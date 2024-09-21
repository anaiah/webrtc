//speech synthesis
const synth = window.speechSynthesis

let voices = []




const bgc = {
    logopen:false,

    //=========================START VOICE SYNTHESIS ===============
    getVoice: async () => {
        voices = synth.getVoices()
        console.log( 'GETVOICE()')
        voices.every(value => {
            if(value.name.indexOf("English")>-1){
                console.log( "bingo!-->",value.name, value.lang )
            }
        })
    },//end func getvoice
    //speak method
    speak:(theMsg)=> {
        console.log("SPEAK()")
        // If the speech mode is on we dont want to load
        // another speech
        if(synth.speaking) {
            //alert('Already speaking....');
            return;
        }	
        const speakText = new SpeechSynthesisUtterance(theMsg);
        // When the speaking is ended this method is fired
        speakText.onend = e => {
            //console.log('Speaking is done!');
        };
        // When any error occurs this method is fired
        speakText.error = e=> {
            console.error('Error occurred...');
        };
        // Checking which voices has been chosen from the selection
        // and setting the voice to the chosen voice
        voices.forEach(voice => {
            if(voice.name.indexOf("English")>-1){	
                ///// take out bring back later, 
                //console.log("speaking voice is ",voice.name)
                speakText.voice = voice
            }
        });
        // Setting the rate and pitch of the voice
        speakText.rate = 1
        speakText.pitch = 1
        // Finally calling the speech function that enables speech
        synth.speak(speakText)
    },//end func speak	

    //login 
    login:()=>{

        const txt = `
        <form  id='loginform' name='loginform'>
        <div class="row">
            <div class="col-lg mb-3">
                <div class="form-outline">
                    <label class="xlabel form-label mb-0" for="rname">Enter Username</label>
                    <input required type="text" id="uid" name="uid"  class="form-control regx" />
                    <div class="invalid-feedback">
                        Required field
                    </div>
                    <div class="valid-feedback">
                        Looking Good!
                    </div>
                </div>
            </div>
        </div>
        </form>
        <div class="row">
            <div class="col align-center">    
                <button type="button" id="loginbtn" onclick="javascript:bgc.savelogin()" class="btn btn-success display-4">
                    <i class="fa fa-user"></i>&nbsp;&nbsp;Login
                </button>
            </div>
        </div>

        `
        if(!bgc.logopen){
            util.Toasted(txt,0)
       
            const elem = document.getElementById('uid')
    
            elem.focus()
    
            bgc.logopen = true
    
            util.loadFormValidation('#loginform')
        }//eif

    },

    closeToast:()=>{
        const toastclose = document.querySelector('.toastify')
        toastclose.classList.add('hide-me')
    
    },
    savelogin:()=>{
        const uid = document.getElementById('uid').value

        if(uid == ""){
            return false
        }else{
            //locastorage
            let db = window.localStorage
            let user = db.getItem('ccfuser')
   
            if(user == "" || !user ){
                db.setItem('ccfuser',uid)

            }else{
                if(user == uid){
                    console.log('posting ', db.getItem('ccfuser'))
                    bgc.closeToast()
                    document.getElementById('judge_name').value = uid
                    return true
                }else{
                    util.Toasted('Login Error!',2000)

                    console.log('error')
                    return false
                }
    
            }
            
            bgc.closeToast()
        }
        //console.log('login')
    },
    
    loader: async (category)=>{

        util.Toasted('<i class="fa fa-spinner fa-pulse fa-fw"></i> Loading..',2000 )


        let aCatType = [
            {
                cat:"singers",
                type:"Soprano"
            },
            {
                cat:"singers",
                type:"Alto"
            },
            {
                cat:"singers",
                type:"Tenor"
            },
            {
                cat:"instrumentalist",
                type:"Guitar"
            },
            {
                cat:"instrumentalist",
                type:"Bass"
            },
            {
                cat:"instrumentalist",
                type:"Drums"
            },
            {
                cat:"instrumentalist",
                type:"Keyboards"
            },
            {
                cat:"instrumentalist",
                type:"Violin"
            },
            {
                cat:"instrumentalist",
                type:"Saxophone"
            }

        ]

        let aCandidate = [
            {
                "Name": "Jaimey Kathryne Cristobal David-Nakar",
                "Role": "singers"
            },
            {
                "Name": "John Nicodemus Aumentado Nakar",
                "Role": "instrumentalist"
            },
            {
                "Name": "Raisa Erica Lauigan Ramos",
                "Role": "singers"
            },
            {
                "Name": "Ma.Deliza B. Arceño",
                "Role": "singers"
            },
            {
                "Name": "Noroniza (Nizza) Tandayu Marabur",
                "Role": "singers"
            },
            {
                "Name": "Myiesha Marie Jerriana C. Uy",
                "Role": "singers"
            },
            {
                "Name": "April Andrea Valera Martinez",
                "Role": "singers"
            },
            {
                "Name": "Arlene Camacho Quintero",
                "Role": "singers"
            }
        ]

        aCandidate.sort((a, b) => a.Name - b.Name);

        bgc.loadData('candidate_talent', aCatType, document.getElementById('exam_type').value)
        bgc.loadData('full_name',aCandidate,'candidate')

        //await fetch(`https://osndp.onrender.com/bgc/getexam/${category}`,{
        await fetch(`http://192.168.199.221:10000/bgc/getexam/${category}`,{
            method:'GET',
            //cache:'reload',
            
        })
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            let container = document.getElementById('maincontainer')

            container.innerHTML ="" //reset container

            let oRate = [
                {cat:"Poor", rate:"1"},
                {cat:"Fair", rate:"2"},
                {cat:"Good", rate:"3"},
                {cat:"Very Good", rate:"4"},
                {cat:"Excellent", rate:"5"}
            ]
            
            let opt, txt = ''
            //write to container
            for(let ikey in data.data){

                for(let xkey in oRate){
                   opt +=`
                         <option value='${oRate[xkey].rate}'>${oRate[xkey].cat}</option>
                         `     
                 }//end for

                txt += `<div class="row">
                        <div class="col-lg mb-3">
                            <div class="form-outline">
                                <label style="text-transform:capitalize" class="xlabel  form-label mb-0" for="rname">${data.data[ikey].exam_category}</label>
                                <select required  id="${data.data[ikey].exam_category}" name="${data.data[ikey].exam_category}" class="form-control regx" >
                                    <option selected value="">--Select Rate--</option>
                                        ${opt}
                                </select>
                                <div class="invalid-feedback">
                                    Required field
                                </div>
                                <div class="valid-feedback">
                                    Looking Good!
                                </div>
                            </div>
                        </div>
                    </div>`
                
                //console.log( data.data[ikey].exam_category)
                opt = ''
            } // end foreach

            txt += `<div class="row">
            <div class="col-lg mb-3">
                <div class="form-outline">
                    <label class="xlabel form-label mb-0" for="rname">REMARKS</label>
                    <textarea id="remarks" name="remarks" class="form-control regx" required></textarea>
                    <div class="invalid-feedback">
                        Required field
                    </div>
                    <div class="valid-feedback">
                        Looking Good!
                    </div>
                </div>
            </div>
            </div>`
            container.innerHTML = txt 
    
        })

    },

    //===select tag
    loadData: (elementid, aArr, category)=>{
        const cSelect = document.getElementById(elementid)
        bgc.removeOptions( cSelect)
        
        let option = document.createElement("option")
        
        option.setAttribute('value', "")
        option.setAttribute('selected','selected')
        
        let optionText = document.createTextNode( "--Pls Select--" )
        option.appendChild(optionText)
        cSelect.appendChild(option)
        
        switch( category){
            case "singers":
            case "instrumentalist":

                for (let key in aArr) {
                    if(aArr[key].cat == category){
                        let option = document.createElement("option")
                    
                        option.setAttribute('value', aArr[key].type)
                        let optionText = document.createTextNode( aArr[key].type )
            
                        option.appendChild(optionText)
                        cSelect.appendChild(option)
                    }//eif
                }//endfor
            break

            case "candidate":
                //aArr.sort((a, b) => a.Name - b.Name);
                //console.log(aArr)
                for (let key in aArr) {
                    if(aArr[key].Role == document.getElementById('exam_type').value ){
                        let option = document.createElement("option")
                    
                        option.setAttribute('value', aArr[key].Name)
                        let optionText = document.createTextNode( aArr[key].Name )
            
                        option.appendChild(optionText)
                        cSelect.appendChild(option)
                    }//eif
                }//endfor
            
            break


        }
       
        cSelect.focus()
        
    },


    removeOptions:( selectElement ) => {
        let i, L =selectElement.options.length -1;
        for(i = L; i>=0; i--){
            selectElement.remove(i)
        }
    },

    //==save to db
    savetodb:async function(url="",xdata={}){
        util.Toasted('<i class="fa fa-spinner fa-pulse fa-fw"></i> Saving to Database..',0 )

        let score = 0
        for (const [key, value] of Object.entries(xdata)) {
            if(parseInt(value)>0 && key!=='date_reg'){
                score += parseInt(value)
                console.log( key, value, score)
            }
        }
        xdata.score = score

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
                score = 0
                
                bgc.speak(data.voice) // speak message

                //reset form
                let xform = document.getElementById('examform')
                xform.reset()

                //reset class in form            
                util.resetFormClass('#examform')

                //close Toastify()
                var toastclose = document.querySelector('.toastify')
                toastclose.classList.add('hide-me')
                
                console.log('===Data==', data)

                let db = window.localStorage
                document.getElementById('judge_name').value = db.getItem('ccfuser')
    
            }
        })
        .catch((error) => {
            // util.Toast(`Error:, ${error.message}`,1000)
            console.error('Error:', error)
        })

        return true //END FUNC
    },

    //===MAIN
    init:()=>{
        console.log('ola, espanyol ka?')
        ////////bgc.speak('WELCOME TO THE UNOFFICIAL CCF BGC EXALT SITE!')
    }
        
}//=======================END MAINOBJECT

bgc.init()