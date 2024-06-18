document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');

    const fetchTasks = async () => {
        const res = await fetch('http://localhost:3000/tasks');
        const tasks = await res.json();
        renderTasks(tasks);
    };

    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                ${task.title}
                <div class="task-actions">
                    <button class="toggle">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            `;

            // Mark task as completed/undo
            li.querySelector('.toggle').addEventListener('click', async () => {
                await fetch(`http://localhost:3000/tasks/${task._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed: !task.completed })
                });
                fetchTasks();
            });

            // Edit task
            li.querySelector('.edit').addEventListener('click', async () => {
                const newTitle = prompt('Edit task', task.title);
                if (newTitle) {
                    await fetch(`http://localhost:3000/tasks/${task._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: newTitle })
                    });
                    fetchTasks();
                }
            });

            // Delete task
            li.querySelector('.delete').addEventListener('click', async () => {
                await fetch(`http://localhost:3000/tasks/${task._id}`, {
                    method: 'DELETE'
                });
                fetchTasks();
            });

            taskList.appendChild(li);
        });
    };

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = newTaskInput.value;
        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, completed: false })
        });
        newTaskInput.value = '';
        fetchTasks();
    });

    fetchTasks();
});
