import Module from '../src/core/module';

interface Todo {
  item: string,
}

class TodoList extends Module {
  list: Todo[] = [{item: "Learn Typescript"}]

  add(todo: Todo, state?: any) {
    this.list.push(todo);
  }

  async moduleDidInitialize() {
    console.log('moduleDidInitialize');
    this.add({item: 'Learn C++'});
  }
}

class Index extends Module {}
class Home extends Module {}
class Other extends Module {}

describe('single module create', () => {
  test('check `create` function', () => {
    const todoList = TodoList.create();
    expect(todoList.ready).toBeFalsy();
    setTimeout(() => {
      expect(todoList.ready).toBeTruthy();
    });
  });
  test('check create a instance & bootstrap', () => {
    const todoList = new TodoList();
    todoList.bootstrap();
    expect(todoList.ready).toBeFalsy();
    setTimeout(() => {
      expect(todoList.ready).toBeTruthy();
    });
  });
});

describe('parent-child set modules', () => {
  test('check `create` function', () => {
    const todoList = new TodoList();
    const index = Index.create({
      modules: [todoList]
    });
    expect(index.ready).toBeFalsy();
    setTimeout(() => {
      expect(index.ready).toBeTruthy();
    });
  });
  test('check `create` function for deep submodules', () => {
    const todoList = new TodoList();
    const index = new Index({
      modules: [todoList]
    });
    const other = new Other({
      modules: [todoList]
    });
    const home = new Home({
      modules: [index, other]
    });
    expect(index.ready).toBeFalsy();
    setTimeout(() => {
      expect(todoList.ready).toBeTruthy();
      expect(index.ready).toBeTruthy();
      expect(home.ready).toBeTruthy();
      expect(other.ready).toBeTruthy();
    });
  });
});

