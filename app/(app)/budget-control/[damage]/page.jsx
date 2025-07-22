import BudgetControlClient from "../budgetControlClient.js";

let briefs = {
    "*": "Cheap & cheerful. Pocket change stuff. Grab, munch, repeat.",
    "**": "Still chill. A solid meal without your wallet crying.",
    "***": "Treat yourself mode. Date night or just feelin’ fancy.",
    "****": "Big bites, big bills. Worth it if you’re hungry and ballin’.",
    "*****": "Full send. Tasting menu? Wine pairing? Yes, chef."
}

let titles = {
    "*":"Pocket Rocket Eats ~ 💸 ~ thefoodclub.be",
    "**":"Solid Bites, No Sweat ~ 💸💸 ~ thefoodclub.be",
    "***":"Treat Mode Activated ~ 💸💸💸 ~ thefoodclub.be",
    "****":"Big Flavour, Bigger Bills ~ 💸💸💸💸 ~ thefoodclub.be",
    "*****":"Full Send Dining ~ 💸💸💸💸💸 ~ thefoodclub.be",
}

export async function generateMetadata({ params }) {
    return {
        title: titles[params.damage],  // Change from params.budget to params.damage
        description: briefs[params.damage],  // Change from params.budget to params.damage
        openGraph: {
            title: titles[params.damage],  // Change from params.budget to params.damage
            description: briefs[params.damage],  // Change from params.budget to params.damage
        },
        alternates: {
            canonical: `https://www.thefoodclub.be/budget-control/${params.damage}`,  // Change from params.budget to params.damage
        },
    }
}


export default function BudgetControlPage({params}) {
    return(
        <BudgetControlClient budget={params.damage} briefs={briefs}/>
    )
}