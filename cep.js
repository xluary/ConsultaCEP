console.log("=== CEP ===");
const fieldCEP = document.querySelector("#cep");
let addresses = (localStorage.addresses) ? JSON.parse(localStorage.addresses): [];

function onlyNumbers(){
    this.value = this.value.replace(/\D+/g,"");
};

function validateEntry(){
    if(this.value.length === 8){
        this.classList.remove("error");
    }else{
        this.classList.add("error");
        this.focus();
    }
};

function getAddress(e){
    e.preventDefault();
    const postalCode = fieldCEP.value;
    const endpoint = `https://viacep.com.br/ws/${postalCode}/json/`;

    const config = {
        method: "GET"
    };

    fetch(endpoint, config)
        .then(function(resp){
            return resp.json();})
        .then(getAddressSuccess)
        .catch(getAddressError);
};

function getAddressSuccess(address){
        const erro = address.erro;
        if (erro){
            alert("Endereço não encontrado!");    
        } else{
            saveAdress(address);
            updateCards();
        }          
}

function getAddressError(){
    alert("Serviço indisponível no momento. Tente novamente mais tarde!");
}

function updateCards(){
    
    const card = addresses.map(function(cardInfo){
       const {logradouro, cep, localidade, uf, bairro} = cardInfo;
        return `<div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${logradouro}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">
                            ${bairro} - ${localidade} - ${uf}
                        </h6>
                        <p class="card-text">${cep}</p>
                    </div>
                </div>`
        }).join("");

    document.querySelector(".cards").innerHTML = card;  
}

function saveAdress(address){
    debugger;
    addresses.push(address);
    localStorage.setItem("addresses", JSON.stringify(addresses));
}

// Mapping Events
fieldCEP.addEventListener("input", onlyNumbers);
fieldCEP.addEventListener("focusout", validateEntry);
document.querySelector(".btn-primary").addEventListener("click", getAddress);
document.addEventListener("DOMContentLoaded", updateCards);