
import z from "zod"

export const categoryValidation =z.enum(["FOOD", "TRANSPORT", "ENTERTAINMENT", "SHOPPING", "HEALTH", "OTHER"]);




export const amountValidation = z.number().int("Amount must be a whole number in paise").min(1, "Amount must be at least 1 paisa");
export const descriptionValidation =z.string().optional()

export const expenseValidation =z.object({
    category:categoryValidation,
    amount:amountValidation,
    description:descriptionValidation 

})



