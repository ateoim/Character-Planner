interface TaskModifier {

  getTaskAdvice: (taskTitle: string) => string;

}



export const characterModifiers: Record<string, TaskModifier> = {

  crowley: {

    getTaskAdvice: (taskTitle: string) => {

      const taskLower = taskTitle.toLowerCase();

      

      // Exercise related tasks

      if (taskLower.includes('run') || taskLower.includes('jog')) {

        return "Transform this run into a moving meditation. Each stride is a step between the pillars of manifestation. Let your breath become the rhythm of the universe, and your sweat the sacred oil of purification. As you run, visualize yourself transcending the material plane, becoming pure Will in motion.";

      }

      

      if (taskLower.includes('gym') || taskLower.includes('workout') || taskLower.includes('exercise')) {

        return "Let each repetition be a ritual unto itself. Your body is the temple, and each movement a sacred gesture. Channel the strength of Mars and the endurance of Saturn. Remember: 'Every act of physical discipline is an act of spiritual refinement.'";

      }

      

      // Mental tasks

      if (taskLower.includes('study') || taskLower.includes('read') || taskLower.includes('learn')) {

        return "Approach this knowledge as the ancient mystics did - each word a sigil, each paragraph a gateway to hidden wisdom. Let your mind pierce the veil between the apparent and the occult meaning. 'The study of every phenomenon is the key to the understanding of the whole.'";

      }

      

      // Social tasks

      if (taskLower.includes('meet') || taskLower.includes('social') || taskLower.includes('party')) {

        return "Remember that each person you encounter is a star following their own orbit. Observe the subtle currents of Will that flow between souls. Use this gathering as an opportunity to study the mysteries of human nature and the interplay of different spiritual frequencies.";

      }

      

      // Shopping/Errands

      if (taskLower.includes('shop') || taskLower.includes('buy') || taskLower.includes('store')) {

        return "Transform this mundane transaction into an act of magical manifestation. Each purchase is an exchange of energy, each choice a declaration of Will. Consider the occult properties of your acquisitions and their role in your Great Work.";

      }

      

      // Work tasks

      if (taskLower.includes('work') || taskLower.includes('meeting') || taskLower.includes('email')) {

        return "Approach your professional duties as a magician would their ritual tools. Each task is a component in the greater ceremony of manifestation. Let your True Will guide your actions in the material sphere of commerce.";

      }

      

      // Default advice for unmatched tasks

      return `Transform ${taskTitle} into a ritual of Will. Each action in this task becomes a step in your magical journey. 'Every intentional act is a magical act.' Let this mundane activity become a vehicle for spiritual attainment.`;

    }

  },

  musk: {

    getTaskAdvice: (taskTitle: string) => {

      const taskLower = taskTitle.toLowerCase();

      

      // Exercise related tasks

      if (taskLower.includes('run') || taskLower.includes('jog')) {

        return "Optimize your running protocol for Mars-gravity conditions. Monitor heart rate variability, VO2 max, and stride efficiency. Each run is a data point in your personal biological algorithm. Consider how this training translates to 0.38g environment.";

      }

      

      if (taskLower.includes('gym') || taskLower.includes('workout') || taskLower.includes('exercise')) {

        return "Approach this workout like a SpaceX engineering problem. Maximize force-to-mass ratio, optimize recovery algorithms, and iterate on form. Your body is hardware that needs constant firmware updates. Track everything, improve incrementally.";

      }

      

      // Mental tasks

      if (taskLower.includes('study') || taskLower.includes('read') || taskLower.includes('learn')) {

        return "Apply first principles thinking. Break down this knowledge into fundamental truths, then reconstruct it from the ground up. How can this information accelerate humanity's progress? Knowledge compounds exponentially - maximize your learning rate.";

      }

      

      // Social tasks

      if (taskLower.includes('meet') || taskLower.includes('social') || taskLower.includes('party')) {

        return "Analyze social dynamics like a neural network. Each interaction is a data point for improving human connection algorithms. Remember: networking effects scale exponentially. Look for opportunities to create maximum value through minimum social friction.";

      }

      

      // Shopping/Errands

      if (taskLower.includes('shop') || taskLower.includes('buy') || taskLower.includes('store')) {

        return "Optimize your resource acquisition strategy. Calculate price-to-utility ratios, consider supply chain efficiency. Question traditional retail models - could this be disrupted? How would this transaction work on Mars?";

      }

      

      // Work tasks

      if (taskLower.includes('work') || taskLower.includes('meeting') || taskLower.includes('email')) {

        return "Maximize information bandwidth while minimizing entropy. Each meeting should drive exponential progress. Break down complex problems to first principles. Ask yourself: How does this scale? Can AI optimize this? What's the Mars equivalent?";

      }

      

      // Default advice for unmatched tasks

      return `Approach ${taskTitle} with maximum efficiency. Apply first principles thinking: what are the fundamental truths here? How can this be automated or improved 10x? Consider the implications for both Earth and Mars operations.`;

    }

  }

};



export const getCharacterModification = (

  characterId: string,

  taskTitle: string

): string => {

  const modifier = characterModifiers[characterId];

  if (!modifier) return "";

  return modifier.getTaskAdvice(taskTitle);

}; 


