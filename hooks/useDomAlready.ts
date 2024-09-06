import { useEffect, useState } from "react";
export default function useDomAlready() {
  // to detect document has been mounted
  const [documentMouned, setDocumentMounted] = useState(false);
  // run after document mounted
  useEffect(() => {
    setDocumentMounted(true);
  }, []);

  return { documentMouned };
}
