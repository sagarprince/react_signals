import './App.css'
import { AddTaskInput } from './components/AddTaskInput/AddTaskInput';
import { TasksList } from './components/Tasks/TasksList';
import { AppContext } from './context/AppContext';
import state from './context/AppState';

function App() {
  console.log('Render App');
  return (
    <AppContext.Provider value={state}>
      <section className='App'>
        <AddTaskInput />
        <TasksList />
      </section>
    </AppContext.Provider>
  )
}

export default App;
