/**
 * StateEvaluator - OCP (Open-Closed Principle)
 * This class is open for extension (by adding rules) 
 * but closed for modification (the eval logic remains the same).
 */
export class StateEvaluator {
    constructor(rules = []) {
        this.rules = rules;
    }

    evaluate(tamagotchi) {
        // Find the first rule that applies
        const rule = this.rules.find(r => r.condition(tamagotchi));
        
        // Return a new instance of the corresponding state class
        if (rule) {
            return new rule.stateClass(tamagotchi);
        }
        
        // Default state if no rules apply
        return null; 
    }
}
