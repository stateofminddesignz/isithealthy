// create boiler plate for an api call vanilla js

const searchBtn = document.getElementById('submit-btn')
const barcodeErr = document.getElementById('error-msg')
searchBtn.addEventListener('click' ,getApiData)



function getApiData() {
   let inputVal = document.getElementById('barcode').value

//display error if input is not 12 digits
if(inputVal.length !==12){
    barcodeErr.innerHTML = 'Please enter a 12 digit barcode'
    return;
}else{
    barcodeErr.innerHTML = ''
}



const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`



    fetch(url)
        .then(response => response.json()) //parse the response as json
        .then(data => {
            console.log(data)
            if(data.status === 1){
                const item = new ProductInfo(data.product)
                item.showInfo();
                item.listIngredients();
                
                //call additinasl stuff
            }else if(data.status === 0){
                
                alert(`product ${inputVal} was not found.`) //tell user barcode not found

            }
            
              
           
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
      
}


class ProductInfo {
    constructor(productData){
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }
    showInfo(){
        document.getElementById('product-image').src=this.image;
        document.getElementById('product-name').innerText=this.name;
        
      
    }

    listIngredients(){
       let tableRef =  document.getElementById('ingredients-table')
     for(let i = 1 ; i < tableRef.rows.length;){ //loops through table and deletes each index at 1

        tableRef.deleteRow(i)
     }

if(!(this.ingredients == null)){
        for( let key in this.ingredients){
            let newRow = tableRef.insertRow(-1);
            let newICell = newRow.insertCell(0);
            let newVCell = newRow.insertCell(1);
            let newIText = document.createTextNode(
                this.ingredients[key].text
            )
            let vegStatus = this.ingredients[key].vegetarian == null ? 'unknown' : this.ingredients[key].vegetarian
            let newVText = document.createTextNode(vegStatus)
            newICell.appendChild(newIText)
            newVCell.appendChild(newVText)

            if(vegStatus === 'yes'){
               newVCell.classList.add('veg-item')

            }else if(vegStatus === 'no'){
                newVCell.classList.add('non-veg-item')
            
            }else if(vegStatus === 'unknown' || vegStatus === 'maybe'){
                newVCell.classList.add('unknown-maybe-item')
            }



        }
    }

}



}
