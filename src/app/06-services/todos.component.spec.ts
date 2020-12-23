import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { from, empty, throwError } from 'rxjs';

describe('TodosComponent', () => {
    let component: TodosComponent;
    let service: TodoService;

    beforeEach(() => {
        service = new TodoService(null);
        component = new TodosComponent(service);
    });

    it('should set todos property with the items returned from the server', () => {
        let todo = [
            { id: 1, title: 'a' },
            { id: 2, title: 'b' },
            { id: 3, title: 'c' },
        ];
        spyOn(service, 'getTodos').and.callFake(() => {
            return from([todo]);
        });
        component.ngOnInit();
        // expect(component.todos.length).toBeGreaterThan(0);
        expect(component.todos.length).toBe(3);
    });

    it('should call the server to save the chanfes when a new todo item is added', () => {
        let spy = spyOn(service, 'add').and.callFake(t => {
            return empty();
        });
        component.add();
        expect(spy).toHaveBeenCalled();
    });

    it('should set the message property if server returns an error when adding a new todo', () => {
        let error = 'error from the server';
        let spy = spyOn(service, 'add').and.returnValue(throwError(error));
        component.add();
        expect(component.message).toBe(error);
    });

    it('should call the server to delete a todo item if the user confirms', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        let spy = spyOn(service, 'delete').and.returnValue(empty());
        component.delete(1);
        expect(spy).toHaveBeenCalledWith(1)
    });

    it('should NOT call the server to delete a todo item if the user cancels', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        let spy = spyOn(service, 'delete').and.returnValue(empty());
        component.delete(1);
        expect(spy).not.toHaveBeenCalled();
    });
});