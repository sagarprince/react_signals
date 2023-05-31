import { useCallback, useEffect } from 'react';
import './App.css'
import { AddTodoForm } from './components/AddTodoForm';
import { Filters } from './components/Filters';
import { Todos } from './components/Todos';
import { AppProvider } from './contexts/AppContext';

function App() {

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const header = document.querySelector('header');
    if (scrollY > 30) {
      header?.classList.add("scrolling");
    } else {
      header?.classList.remove("scrolling");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll])

  return (
    <AppProvider>
      <section className='App'>
        <header>
          <AddTodoForm />
          <Filters />
        </header>
        <Todos />
      </section>
    </AppProvider>
  )
}

export default App;
