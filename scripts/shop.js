document.querySelector(".get-items").addEventListener("click", getItems);


function getItems(){
    const itemName = document.querySelector("select").value;
    const namee = document.getElementById('name').value;
    console.log(itemName)
 
    let strnng = '';
    let checked_boxes = document.querySelectorAll('input[type=checkbox]:checked');
    for(i=0; i<checked_boxes.length; i++){
        strnng += checked_boxes[i].value+',';
    }
    console.log(strnng);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.allorigins.win/raw?url=http://www.recipepuppy.com/api/?i=${strnng}&q=${itemName}`, true);
    //console.log(`https://api.allorigins.win/raw?url=http://www.recipepuppy.com/api/?i=${strnng}&q=${itemName}`);

    xhr.onload = function(){
        if (this.status === 200){
            console.log(this.responseText);
            const response = JSON.parse(this.responseText);
            
            let output = "";
            if(response.type = "success"){
                response.results.forEach(recipe => {
                    console.log(recipe);
                    var strng_response = JSON.stringify(recipe);
                    //console.log(recipe);
                    var value = strng_response.replace(/\\r/g, "");
                    var value2 = value.replace(/\\t/g, "");
                    var value3 = value2.replace(/\\n/g, "");
                    var value4 = value3.replace(/\'/g, "");
                    var value5 = value4.replace(/\\"/g, "");
                    var value6 = value5.replace(/&/g, "and");
                    //console.log(value3);
                    var title_obj = JSON.parse(value6);
                    //console.log(title_obj);
                    var price = Math.floor((Math.random()*50)+1)

                    output += `
                       <img src= ${recipe.thumbnail} style="height:100px;width:110px;padding: 5px;border: 1px solid #fff;"></img>
                        <li style="display:inline-block;padding-right: 30px;color:white;font-size:20px;"><b>RECIPE NAME:</b> ${recipe.title}  -  ${price}$<br><b>INGREDIENTS:</b> ${recipe.ingredients}<br></li>
                        <button style="padding:5px 15px;background:rgb(255, 255, 255); border: none;cursor:pointer;color: rgb(111, 106, 106);border-radius: 5px;" onclick="put_to_db('${title_obj.title}','${namee}')">order</button><br>
                    `;
                });
            }
            else{
                output += "could not get item(s)";
            }
            document.querySelector('.itemList').innerHTML = output;
        }
    }
    xhr.send();
}

function put_to_db(){
    console.log(arguments[0]);
    console.log(arguments[1]);
    var stringg = "/insert?f="+arguments[0]+"&s="+arguments[1];
    console.log(stringg);

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", stringg, true);
    xmlhttp.send();
}