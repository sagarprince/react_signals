import { useEffect } from 'react';

export default function useDocumentTitle(title: any) {
  const prefix = 'Email Champion - ';
  useEffect(() => {
    document.title = prefix + title;
  }, [title]);
}
