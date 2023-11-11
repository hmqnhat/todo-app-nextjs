interface ITask {
    id: string;
    content: string;
    isCompleted: boolean;
    dueDate: string ;
    addedDate: string;
    [key: string]: string | boolean 
  }