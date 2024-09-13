//speech synthesis
const synth = window.speechSynthesis

let voices = []




const bgc = {

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

    loader:(elementid)=>{

        console.log(elementid)
        
        let txt = null
        if(elementid==""){
            return true
        }
        if(elementid=="singer"){
            txt = `
            <!-- for singers -->
            <div class="row">
                <div class="col-lg mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq1">Technique / Skill</label>
                        <input onclick="this.focus()" required type="number" id="technique" name="technique" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
                <div class="col-lg mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq2">Dynamics</label>
                        <input required type="number" id="dynamics" name="dynamics" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq3">Vocal Quality</label>
                        <input required type="number" id="vocal_quality" name="vocal_quality" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
                <div class="col-lg mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq4">Harmony</label>
                        <input required type="number" id="harmony" name="harmony" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq5">Stage Presence</label>
                        <input required type="number" id="stage_presence" name="stage_presence" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>

                    </div>
                </div>
                <div class="col-12 mb-3">
                    <div class="form-outline">
                        &nbsp;
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="remarks">Remarks</label>
                        <textarea required id="remarks" name="remarks" rows="3" class="form-control regx" ></textarea>
                        <div class="invalid-feedback">
                            Pls make a remark!
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
            </div>
            
            `    
        }else{
            txt = `
             <!-- INSTRUMENTALIST -->
            <div class="row">
                <div class="col-lg mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq1">Technique / Skill</label>
                        <input required type="number" id="technique" name="technique" min=1 max=5 class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
                <div class="col-lg mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq2">Dynamics</label>
                        <input required type="number" id="dynamics" name="dynamics" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12 mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="rq5">Stage Presence</label>
                        <input required type="number" id="stage_presence" name="stage_presence" min="1" max="5" class="form-control regx" />
                        <div class="invalid-feedback">
                            Enter Numeric Value 1 to 5
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
                <div class="col-12 mb-3">
                    <div class="form-outline">
                        &nbsp;
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 mb-3">
                    <div class="form-outline">
                        <label class="form-label mb-0" for="ins_remarks">Remarks</label>
                        <textarea required id="remarks" name="remarks" rows="3" class="form-control regx" ></textarea>
                        <div class="invalid-feedback">
                            Pls make a remark!
                        </div>
                        <div class="valid-feedback">
                            Looking Good!
                        </div>
                    </div>
                </div>
            </div>

            `
        }//endif

        document.getElementById('maincontainer').innerHTML = ""
        document.getElementById('maincontainer').innerHTML = txt

        //if automatic added new fields
        //then fire loadformvalidation
        util.loadFormValidation('#examform')
    },

    savetodb:async function(url="",xdata={}){
        Toastify({
            text: '<i class="fa fa-spinner fa-pulse fa-fw"></i> Saving to Database..',
            duration:0,
            close:false,
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
                
                bgc.speak(data.voice)

                let xform = document.getElementById('examform')
                xform.reset()
                            
                util.resetFormClass('#examform')

                var toastclose = document.querySelector('.toastify')
                toastclose.classList.add('hide-me')
                console.log(data.voice)
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
        bgc.speak('WELCOME TO THE UNOFFICIAL CCF BGC EXALT SITE!')
    }
        
}//=======================END MAINOBJECT

bgc.init()