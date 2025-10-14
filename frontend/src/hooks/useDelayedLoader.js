import { useState, useEffect } from 'react';

export default function useDelayedLoader(active, { delay = 200 } = {}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let t;
    if (active) {
      t = setTimeout(() => setShow(true), delay);
    } else {
      setShow(false);
    }
    return () => clearTimeout(t);
  }, [active, delay]);

  return show;
}
