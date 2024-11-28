import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { Character } from "../types/types";

const useAmbientSound = (character: Character) => {
  const soundRef = useRef<Howl | null>(null);

  const sounds = {
    crowley: {
      ambient: "/sounds/mystical-ambient.mp3",
      taskComplete: "/sounds/magical-chime.mp3",
    },
    musk: {
      ambient: "/sounds/tech-ambient.mp3",
      taskComplete: "/sounds/digital-complete.mp3",
    },
  };

  useEffect(() => {
    // Stop previous sound if it exists
    if (soundRef.current) {
      soundRef.current.stop();
    }

    // Create new ambient sound for selected character
    const characterSounds = sounds[character.id as keyof typeof sounds];
    if (characterSounds) {
      soundRef.current = new Howl({
        src: [characterSounds.ambient],
        loop: true,
        volume: 0.3,
      });

      soundRef.current.play();
    }

    // Cleanup on unmount or character change
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, [character.id]);

  const playTaskComplete = () => {
    const characterSounds = sounds[character.id as keyof typeof sounds];
    if (characterSounds) {
      const completeSound = new Howl({
        src: [characterSounds.taskComplete],
        volume: 0.5,
      });
      completeSound.play();
    }
  };

  return { playTaskComplete };
};

export default useAmbientSound;
