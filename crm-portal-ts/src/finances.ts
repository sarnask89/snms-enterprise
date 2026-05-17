type GrossAndVat = { gross?: number; vatPercentage?: number };  // Define an interface or type to hold both values.
function calculateNetFromGross(gross: Decimal | undefined, vat_percent: Decimal | undefined) : Promise<Decimal>{  
    return new Promise((resolve, reject) => {     /* Convert async logic into promise-based */ 
        if (!gross || !vat_percent){             // Handle missing values. If any is null or not defined it will resolve with Decimal(0). Otherwise the function returns immediately without waiting for other operations to complete and resolving Promise object asynchronously, allowing you do something else while this promise fulfills (like calling another API endpoint)
            return resolve(new Decimal('0.0'));  // Resolve it here with a default value of 'Decimal' type in TypeScript which is equivalent to Python decimal or float data types respectively and then reject the Promise object if any parameter passed was undefined/null, otherwise promise will be fulfilled asynchronously
        }    
        
       const grossValue = new Decimal(String(gross));  // Convert 'Decimal' type in TypeScript which is equivalent to Python decimal or float data types respectively.  
       let vatPercentageVal: number;                    /* Define a variable for VAT percentage */   
        if (typeof vat_percent === "string") {         // If the passed parameter was string, then convert it into 'number' type in TypeScript which is equivalent to Python decimal or float data types respectively. 
            const parsedVatPercent = parseFloat(vat_percent as any);   /* Parse VAT percentage from a possible non-numeric value */   
             if (isNaN(parsedVatPercent)) {                  // If the passed parameter was not able to be converted into 'number' type, then reject it.  Otherwise resolve promise with parsed number and vat_percentageVal as Decimal data types in TypeScript which is equivalent Python decimal or float dataypes respectively
                return reject(new Error("Invalid VAT Percent"));   // Reject the Promise object if any parameter passed was undefined/null, otherwise promise will be fulfilled.  The error message "Vat percentage must not empty" can also handle this case by returning a new instance of 'Error' type in TypeScript
             } else {                                        /* If parsed VAT Percentage is valid then assign it to vatPercentageVal */   
                 return resolve(new Decimal((grossValue / (1 + ((parsedVatPercent as number)  /  100))).toFixed(2))); // Resolve promise with the calculated net price. The result will be a 'Decimal' data type in TypeScript which is equivalent Python decimal or float dataypes respectively
             }   
        } else {                                        /* If VAT Percentage passed as string then convert it into number */ 
            vatPercentageVal = parseInt(vat_percent.toString());   // Parse the 'Vat percentage' from a possible non-numeric value and assign to variable if valid, otherwise reject promise with error message "Invalid VAT Percent" as above in case of invalid string passed
        } 
    });     /* End Promise conversion */     
}