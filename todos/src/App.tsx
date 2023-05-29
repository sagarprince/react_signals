import './App.css'
import { AddTaskInput } from './components/AddTaskInput/AddTaskInput';
import { TasksList } from './components/Tasks/TasksList';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <section className='App'>
        <AddTaskInput />
        <TasksList />
      </section>
    </AppProvider>
  )
}

export default App;
