import BudgetControlClient from "../budgetControlClient.js";

//todo: set metadata

export default function BudgetControlPage({params}) {

    let briefs = {
        "*": "Cheap & cheerful. Pocket change stuff. Grab, munch, repeat.",
        "**": "Still chill. A solid meal without your wallet crying.",
        "***": "Treat yourself mode. Date night or just feelin’ fancy.",
        "****": "Big bites, big bills. Worth it if you’re hungry and ballin’.",
        "*****": "Full send. Tasting menu? Wine pairing? Yes, chef."
    }


    return(
        <BudgetControlClient budget={params.damage} briefs={briefs}/>
    )
}