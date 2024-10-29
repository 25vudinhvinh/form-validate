const Validator = (options) =>{
    const formElement = document.querySelector(options.form)
    const selectorRules = {}
    const validate = (inputElement, rule)=>{
        const errorElement = getParent(inputElement, options.parentInput).querySelector('.form-message')
        const rules = selectorRules[rule.selector]
        let errorMessage 
        for (var i = 0; i < rules.length; ++i){
           errorMessage = rules[i](inputElement.value)
           if(errorMessage) break
        }
        if(errorMessage){
            errorElement.innerText = errorMessage
            getParent(inputElement, options.parentInput).classList.add('invalid')
        }else{
            errorElement.innerText = ''
            getParent(inputElement, options.parentInput).classList.remove('invalid')
        }
      
        return !errorMessage
    }

    // ham get parentInput
    const getParent = (element, parent)=>{
        while(element.parentElement){
            if(element.parentElement.matches(parent)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    if (formElement){
        formElement.onsubmit = (e) =>{
            e.preventDefault()

            let isFormValid = true

            options.rules.forEach((rule) =>{
            const inputElement = formElement.querySelector(rule.selector)
              const isValid = validate(inputElement, rule)
                if(!isValid){
                    isFormValid = false
                }
            })

            if(isFormValid){
                if (typeof options.onSubmit === 'function'){
                    const enableInput = formElement.querySelectorAll('[name]')
                    const formValues = Array.from(enableInput).reduce((values, input) =>{
                        values[input.name] = input.value
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }
            }
        }
        options.rules.forEach(rule =>{
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            const inputElement = formElement.querySelector(rule.selector)
            if (inputElement){
                const errorElement = getParent(inputElement, options.parentInput).querySelector('.form-message')
                inputElement.onblur = ()=>{
                    validate(inputElement, rule)
                }
                inputElement.oninput = ()=>{
                    errorElement.innerText = ''
                    getParent(inputElement, options.parentInput).classList.remove('invalid')
                }   
            }
        })
    }
}


Validator.isRequired = (selector) =>{
    return {
    selector,
    test: (value) =>{
        return value ? undefined : 'Vui long nhap truong nay.'
    }}
}

Validator.isEmail = (selector)=>{
    return {
        selector,
        test: (value) =>{
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return value.match(regex) ? undefined : 'Vui long nhap email.'
        }}
}

Validator.minLength = (selector, min)=>{
    return {
        selector,
        test: (value)=>{
            return value ? undefined : `Vui long nhap toi thieu ${min} ki tu.`
        }
    }
}

Validator.confirmed = (selector, password)=>{
    return {
        selector,
        test : (value)=>{
            return value === password() ? undefined : 'Mat khau khong khop.'
        }   
    }
}