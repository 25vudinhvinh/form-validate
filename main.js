const Validator = (options) =>{
    const formElement = document.querySelector(options.form)
    if (formElement){
        options.rules.forEach(rule =>{
            const inputElement = formElement.querySelector(rule.selector)
            if (inputElement){
                const errorElement = inputElement.parentElement.querySelector('.form-message')
                inputElement.onblur = ()=>{
                    const errorMessage = rule.test(inputElement.value)
                    if(errorMessage){
                        errorElement.innerText = errorMessage
                        inputElement.parentElement.classList.add('invalid')
                    }
                }
                inputElement.oninput = ()=>{
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
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