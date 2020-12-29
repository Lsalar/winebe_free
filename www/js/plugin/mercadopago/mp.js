var __mercadopago 		= __mercadopago || {};
__mercadopago.prepara 	= 
{
	publicKey 	: "yourmpcode",
	doSubmit 	: false,
	clavePublica: function(cp = false)
	{
		if(cp != false)
			cp = this.publicKey;
		Mercadopago.setPublishableKey(cp);
		setTimeout(function(){Mercadopago.getIdentificationTypes();},300);
	},
	creaToken : function(_form, _callback)
	{
		Mercadopago.createToken(_form, _callback);
	},
	addEvent: function (to, type, fn)
	{
	    if(document.addEventListener)
	        to.addEventListener(type, fn, false);
	    else if(document.attachEvent)
	        to.attachEvent('on'+type, fn);
	    else
	        to['on'+type] = fn;
	},
	getBin: function(_number) 
	{
		var cardnumber = _number;
		return cardnumber.value.substring(0,6);
	},
	guessingPaymentMethod: function(event) 
	{
	    this.value = this.value.replace(/\s/g, '');
	    var bin = __mercadopago.prepara.getBin(_e.d.cardNumber);
	    if (event.type == "keyup") 
	    {
	        if (bin.length >= 6) 
	        {
	            window.Mercadopago.getPaymentMethod({
	                "bin": bin
	            }, __mercadopago.prepara.setPaymentMethodInfo);
	    	}
	    } 
	    else 
	    {
	        setTimeout(function() {
	            if (bin.length >= 6) 
	            {
	                window.Mercadopago.getPaymentMethod({
	                    "bin": bin
	                }, __mercadopago.prepara.setPaymentMethodInfo);
	            }
	        }, 100);
	    }
	},
	setPaymentMethodInfo: function(status, response) 
	{
	    if (status == 200) 
	    {
	        const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');

	        if (paymentMethodElement)
	            paymentMethodElement.value = response[0].id;
	        else 
	        {
	            const 	input = document.createElement('input');
			            input.setAttribute('name', 'paymentMethodId');
			            input.setAttribute('type', 'hidden');
			            input.setAttribute('value', response[0].id);     
	            form.appendChild(input);
	        }

	        Mercadopago.getInstallments({
	            "bin": __mercadopago.prepara.getBin(_e.d.cardNumber),
	            "amount": parseFloat(document.querySelector('#amount').value),
	        }, __mercadopago.prepara.setInstallmentInfo);

	    } 
	    else
	        alert(`payment method info error: ${response}`, 4000);
	},
	setInstallmentInfo: function(status, response) 
	{
        var selectorInstallments 	= document.querySelector("#installments"),
        fragment 					= document.createDocumentFragment();
        selectorInstallments.options.length = 0;

        if (response.length > 0) 
        {
            var option = new Option("Seleccione...", '-1'),
            payerCosts = response[0].payer_costs;
            fragment.appendChild(option);

            for (var i = 0; i < payerCosts.length; i++)
                fragment.appendChild(new Option(payerCosts[i].recommended_message, payerCosts[i].installments));

            selectorInstallments.appendChild(fragment);
            selectorInstallments.removeAttribute('disabled');
        }
    },
	doPay: function(event)
	{
	    event.preventDefault();
	    this.classList.add("is-loading");
	    this.setAttribute("disabled","disabled");
	    if(!this.doSubmit)
	    {
	        var $form = document.querySelector('#pay');
	        window.Mercadopago.createToken($form, __mercadopago.prepara.sdkResponseHandler); // The function "sdkResponseHandler" is defined below
	        return false;
	    }
	},
	sdkResponseHandler: function(status, response) 
	{
	    if (status != 200 && status != 201)
	    {
	        alert("Verifique la informaci&oacute;n completada", 3000);
	        _e.d.submit_mp.classList.remove("is-loading");
	    	_e.d.submit_mp.removeAttribute("disabled","disabled");
	    }
	    else
	    {
	    	if(document.getElementById('mptoken') != null)
	    		document.getElementById('mptoken').remove();

	        var form = document.querySelector('#pay');
	        var card = document.createElement('input');
		        card.setAttribute('name', 'token');
		        card.setAttribute('id', 'mptoken');
		        card.setAttribute('type', 'hidden');
		        card.setAttribute('value', response.id);
	        
	        	form.appendChild(card);
	        	console.log(card);
	        	this.doSubmit=true;
	        	
	        	$__envia_ajax_mercadopago();
	    }
	}
};
