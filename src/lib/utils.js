import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';

const useDeltaTime = () => {
  const prevTime = useRef(Date.now());
  const deltaTime = useRef(0);

  useFrame(() => {
    deltaTime.current = (Date.now() - prevTime.current) * 0.001;
    prevTime.current = Date.now();
  });
  
  return deltaTime;
}

const useCombinedRefs = (...refs) => {
  
  const targetRef = useRef()

  useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

export { useDeltaTime, useCombinedRefs };