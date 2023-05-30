import './App.css'
import { AddTaskInput } from './components/AddTaskInput';
import { Filters } from './components/Filters';
import { TasksList } from './components/Tasks';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <section className='App'>
        <AddTaskInput />
        <Filters />
        <TasksList />
      </section>
    </AppProvider>
  )
}

export default App;
