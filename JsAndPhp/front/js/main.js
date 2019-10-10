
var arrObjects=[];
var result;
var wrapper=document.querySelector('.col-md-12.products>.row');
var dollarRate=50;
var range=document.querySelector("input[type='range']");
var file = "/../js_part/data.json";
var myObj;
var xmlhttp = new XMLHttpRequest();



xmlhttp.open("GET", file, true);
xmlhttp.onreadystatechange = function()
{
    if (this.readyState == 4 && this.status == 200)
    {
        myObj = JSON.parse(this.responseText);
        init(myObj);
    }
};
xmlhttp.send();



function init(data){  
  for(el in data.Value.Goods){
    var obj=data.Value.Goods[el];
    arrObjects[el]={                
         Group:store[obj.G].G,
         Name:store[obj.G]["B"][obj.T]["N"],
         Price:obj.P,
         Count:obj.P
    }
}

//группировка объектов по группам (книги,сувениры....)
result = arrObjects.reduce(function (r, a) {
  r[a.Group] = r[a.Group] || [];
  r[a.Group].push(a);
  return r;
}, Object.create(null));
this.render();
}



//обработчик на ползунок, отвечающий за значения курса доллара 
range.addEventListener("change",function()
{
  document.getElementById('rangeValue').innerHTML = this.value;
  var flag;
  if(dollarRate<this.value)
    flag=false;
  else 
    flag=true;
  dollarRate=this.value;
  wrapper.innerHTML="";
  render(flag);
});


//добавление элемента в корзину 
function addToCart(){
  var name=this.getAttribute("data-name");
  var price=this.getAttribute("data-price")  

  var modal=document.querySelector("#test");
  
  var divColSmTitle=document.createElement("div");
  divColSmTitle.className="col-sm-8";
   var title=document.createElement("p");
   title.innerText=name;
   divColSmTitle.append(title);


   var divColSmPrice=document.createElement("div");
   divColSmPrice.className="col-sm-2";
   title=document.createElement("p");
   title.innerText=price;
   divColSmPrice.append(title);


   var divColSmClose=document.createElement("div");
   divColSmClose.className="col-sm-2";
   title=document.createElement("p");
   title.innerHTML="&times;";
   title.setAttribute("data-name",name);
   title.setAttribute("data-price",price);

   var TotalPrice=document.querySelector("#cartFinalPrice");  
   var Tprice=parseInt(TotalPrice.innerText)+parseInt(price,10);
   TotalPrice.innerText=parseInt(Tprice);


   //обработчик удаления элемента из корзины
   title.addEventListener("click",function(){
    var name=this.getAttribute("data-name");
    var price=this.getAttribute("data-price")
    var delitem=document.querySelector(".row.justify-content-center[data-name='"+name+"']");
    delitem.remove();
    var bagdes=document.querySelector("span[class='badge badge-light']");
    bagdes.innerText--;
    var TotalPrice=document.querySelector("#cartFinalPrice");  
    var Tprice=parseInt(TotalPrice.innerText)-parseInt(price,10);
    TotalPrice.innerText=parseInt(Tprice);
   })   
   divColSmClose.append(title);


   var row=document.createElement("div");
   row.className="row justify-content-center";
   row.setAttribute("data-name",name);
   row.setAttribute("data-price",price); 
   row.append(divColSmTitle,divColSmPrice,divColSmClose);
   modal.append(row);


  var bagdes=document.querySelector("span[class='badge badge-light']");
  bagdes.innerText++;
}

//отрисовка элементов страницы
function render(flag){
  for(var r in result){
    //console.log(result[r]);  
    for(key in result[r]){
      var divColSm=document.createElement("div");
      divColSm.className="col-sm-3";
      

      var divProd=document.createElement("div");
      if(flag)
        divProd.className="product bg-dark"; 
      else 
        divProd.className="product bg-light"; 
  
      var title=document.createElement("p");
      title.className="product-title";
      title.innerText=result[r][key]['Name'];

      var price=document.createElement("p");
      price.className="product-price";
      price.innerText=result[r][key]['Price']*dollarRate+ " ₽";
      price.append(document.createElement("br"));

      var btn=document.createElement("button");
      btn.setAttribute("type","button");
      btn.setAttribute("data-name",result[r][key]['Name']);
      btn.setAttribute("data-price",result[r][key]['Price']*dollarRate);
      btn.setAttribute("data-count",result[r][key]['Count']);

      btn.addEventListener("click",addToCart);      
      
      btn.innerText="В Корзину";
      btn.className="btn btn-info wrap-normal";
      price.append(btn);


      
      divProd.append(title,price);
      divColSm.append(divProd);
      wrapper.append(divColSm);

      console.log(result[r][key]['Name']);
    }
  }
}

