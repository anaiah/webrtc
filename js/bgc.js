

const bgc = {
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
                        <input onclick="this.focus()" required type="number" id="rq1" name="rq1" min="1" max="5" class="form-control regx" />
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
                        <input required type="number" id="rq2" name="rq2" min="1" max="5" class="form-control regx" />
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
                        <input required type="number" id="rq3" name="rq3" min="1" max="5" class="form-control regx" />
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
                        <input required type="number" id="rq4" name="rq4" min="1" max="5" class="form-control regx" />
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
                        <input required type="number" id="rq5" name="rq5" min="1" max="5" class="form-control regx" />
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
                        <input required type="number" id="ins_rq1" name="ins_rq1" min=1 max=5 class="form-control regx" />
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
                        <input required type="number" id="ins_rq2" name="ins_rq2" min="1" max="5" class="form-control regx" />
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
                        <input required type="number" id="ins_rq5" name="ins_rq5" min="1" max="5" class="form-control regx" />
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
                        <textarea required id="ins_remarks" name="ins_remarks" rows="3" class="form-control regx" ></textarea>
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

    

    init:()=>{
        console.log('ola, espanyol ka?')
    }
        
}//=======================END MAINOBJECT

bgc.init()