const util = {

    //generate random numbers
    generateRandomDigits : (n) => {
        return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
    },

    scrollsTo:(cTarget)=>{
        const elem = document.getElementById(cTarget)
        elem.scrollIntoView()
    },

    //==========FOR ALL THE DATA ENTRY FORM LOAD THIS FIRST TO BE ABLE TO BE VALIDATED ===//
    loadFormValidation:(eHashFrm)=>{

        console.log('=== LOADINGFORM VALIDATION ====',eHashFrm)

        let aForms = [eHashFrm] 
        let aFormx
    
        
        //loop all forms
        aForms.forEach( (element) => {
            aFormx = document.querySelectorAll(element)
            //console.log(aFormx[0])
            if(aFormx){
                let aFormz = aFormx[0]
                //console.log(aFormz.innerHTML)
                Array.from(aFormz.elements).forEach((input) => {
                    if(!input.classList.contains('p1') &&
                        !input.classList.contains('p2')){//process only non-password field

                            //console.log(input)
                            input.addEventListener('keyup',(e)=>{
                                //console.log('keyup')
                                if(input.checkValidity()===false){
                                    input.classList.remove('is-valid')
                                    input.classList.add('is-invalid')
                                    e.preventDefault()
                                    e.stopPropagation()
                                } else {
                                    input.classList.remove('is-invalid')
                                    input.classList.add('is-valid')
                                } //eif
                            },false)
                            input.addEventListener('blur',(e)=>{
                                //console.log('nagblur')
                                if(input.checkValidity()===false){
                                    input.classList.remove('is-valid')
                                    input.classList.add('is-invalid')
                                    e.preventDefault()
                                    e.stopPropagation()
                                } else {
                                    input.classList.remove('is-invalid')
                                    input.classList.add('is-valid')
                                } //eif
                            },false)
                    }else{ //=== if input contains pssword field
                        if(input.classList.contains('p1')){
                            if(eModal=="signupModal"){
                                util.passwordCheck(input,passwordAlert)        
                            }
                        }else{
                            util.passwordFinal(input)
                        }
                    }//else password field
                }) //end all get input
            }
        })///=====end loop form to get elements	
    },

    //==========WHEN SUBMIT BUTTON CLICKED ==================
    validateMe: async (frmModal, frm, classX)=>{
        console.log('validateMe()===', frmModal, frm)
        const forms = document.querySelectorAll(frm)
        const form = forms[0]
        let xmsg
        let aValid=[]
        Array.from(form.elements).forEach((input) => {
            if(input.classList.contains(classX)){
                aValid.push(input.checkValidity())
                if(input.checkValidity()===false){
                    console.log('invalid ',input)
                    input.classList.add('is-invalid')
                    input.classList.remove('is-valid')
                }else{
                    input.classList.add('is-valid')
                    input.classList.remove('is-invalid')
                }
            }
        })
        if(aValid.includes(false)){
            console.log('====DON\'T POST PLS CHECK BLANK ITEMS,ERRORS!!!...=====')
            return false
        }else{
            //getform data for posting
            const mydata = document.getElementById(frm.replace('#',''))
            let formdata = new FormData(mydata)

            let objfrm = {}
            //// objfrm.grp_id="1" <-- if u want additional key value
            for (var key of formdata.keys()) {
                if(key=="pw2"){
                    //console.log('dont add',key)
                }else{
                objfrm[key] = formdata.get(key);
                }
            }
            objfrm.date_reg = util.getDate()
            
            //=== POST NA!!!
            switch(frm){ 
                case "#examform":
                
                    //bgc.savetodb(`https://osndp.onrender.com/medrxpost`,objfrm)
                    bgc.savetodb(`http://192.168.54.221:10000/bgc/savetodb`,objfrm)

                    //===to close toastify
                    ///var toastclose = document.querySelector('.toastify')
                    //toastclose.classList.add('hide-me')
                
                break

                case '#medrxForm':
                    xmsg = "<div><i class='fa fa-spinner fa-pulse' ></i>  Saving to Database please wait...</div>"
                    //util.alertMsg( xmsg,'danger','registerPlaceHolder')
                    Toastify({
                        text: ` ${xmsg}`,
                        duration:4000,
                       // close:true,
                        position:'center',
                        offset:{
                            x: 0,
                            y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                        },
                        escapeMarkup:false, //to create html
                        style: {
                          background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();

                    //add email
                    objfrm.email = document.getElementById('femail').value
                    objfrm.license = document.getElementById('fdoclicense').value
                    objfrm.rx =   cam.rxcart

                    console.log('DEADEND UNA',objfrm)

                    util.medrxPost(`https://osndp.onrender.com/medrxpost`,objfrm)
                    //util.medrxPost(`http://192.168.89.221:10000/medrxpost`,objfrm)
                    
                
                    break

            }//end switchx
        }
    },

    //post medrx
    medrxPost:async function(url="",xdata={}){
        //alert(url)
        fetch(url,{
            method:'POST',
            //cache:'no-cache',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(xdata)
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            if(data.status){
                
                Toastify({
                    text: ` ${data.message}`,
                    duration:4000,
                   // close:true,
                    position:'center',
                    offset:{
                        x: 0,
                        y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                    },
                    escapeMarkup:false, //to create html
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
                
                let xform = document.getElementById('medrxForm')
                xform.reset()
                
                util.resetFormClass('#medrxForm')

                //hide modal
                util.hideModal('medrxmodal')

            }else{
                //util.speak(data.voice)
                Toastify({
                    text: ` ${data.message}`,
                    duration:4000,
                   // close:true,
                    position:'center',
                    offset:{
                        x: 0,
                        y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                    },
                    escapeMarkup:false, //to create html
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();

                return false
            }//eif
        })
        .catch((error) => {
        // util.Toast(`Error:, ${error.message}`,1000)
        console.error('Error:', error)
        })
    },


    //show modal box
    modalShow:(modalToShow)=>{

        console.log('====util.modalShow() Loading... ======', modalToShow)
        
        //off keyboard cofig
        const configObj = { keyboard: false, backdrop:'static' }
        
        switch( modalToShow ){
            
            case "medrxmodal":
                const medrxmodal =  new bootstrap.Modal(document.getElementById(modalToShow), configObj);
                medrxmodal.show()

            break

            case "exammodal":
                const exammodal =  new bootstrap.Modal(document.getElementById(modalToShow), configObj);
                exammodal.show()
        
            break

        }//switch end
    },

    hideModal:(cModal,nTimeOut)=>{
        setTimeout(function(){ 
            const xmodal =  bootstrap.Modal(document.getElementById(cModal));
            // const myModalEl = document.getElementById(cModal)
            // let xmodal = bootstrap.Modal.getInstance(myModalEl)
            xmodal.modal('hide')
            xmodal.hide()
        }, nTimeOut)
    },

    getDate:()=>{
        var today = new Date() 
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
        var yyyy = today.getFullYear()
        today = mm + '-' + dd + '-' + yyyy
        return today
    },

    //==============FORM FUNCS ===========
    clearBox:function(){
        let reset_input_values = document.querySelectorAll("input[type=text]") 
        for (var i = 0; i < reset_input_values.length; i++) { //minus 1 dont include submit bttn
            reset_input_values[i].value = ''
        }
    },
    //remove all form class
    resetFormClass:(frm)=>{
        const forms = document.querySelectorAll(frm)
        const form = forms[0]
        Array.from(form.elements).forEach((input) => {
            input.classList.remove('was-validated')
            input.classList.remove('is-valid')
            input.classList.remove('is-invalid')
        })
    },
}//end obj main util


