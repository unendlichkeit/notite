//custom select menu
var initCustomSelect = (function letitfloat(){
	var selects = document.querySelectorAll('.float-customSelect');

	//ascunde select tag si creaza optiunile
	for(var i = 0; i < selects.length; i++)
	{
		
		var theInput = selects[i].querySelector('input');
		var options = selects[i].querySelectorAll('option');
		var multipleChoice = selects[i].querySelector('select').getAttribute('multiple');
		var listParent = selects[i].querySelector('ul');

		//seteaza clasa 'active' daca e deja definita o valoare pt input cand se incarca pagina
		if(theInput.value)
		{
			selects[i].className = selects[i].className + ' active';
		}
		//if select has attribute 'multiple', set 'data-multiple' attribute on the input
		if(typeof multipleChoice !== 'object')
		{
			//if not null
			theInput.setAttribute('data-multiple', true);
		}

		selects[i].querySelector('select').style.display = 'none';
		if( selects[i].querySelector('img.arrowIcon') ) selects[i].querySelector('img.arrowIcon').style.display = 'inline-block';
		theInput.style.display = 'block';
		listParent.style.display = 'block';
		
		for(var j = 0; j <= options.length-1; j++)
		{
			var li = document.createElement('li');
			li.innerHTML = options[j].innerText;
			li.setAttribute('data-value', options[j].value);
			listParent.appendChild(li);
		};
	};


	//deschide/inchide lista
	function toggleList(e) {
		e.stopPropagation();
		// console.log('click input din float script');
		var target = e.target; //inputul
		let ul = target.parentElement.querySelector('ul');
		let lis = ul.querySelectorAll('li'); 

		//for multiple select options:
		var countSelections = [];

	
		//set selected option
		function setOption(e)
		{
			e.stopPropagation();
			// console.log('floating script li click');
			// console.log(countSelections);
			var val = this.getAttribute('data-value');
			
			/**
			 * input.value returns what the user sees in the input field 
			 * input.getAttribute('value')/setAttribute('value') work directly on the 'value' attribute. The value of the two can be different
			*/

			/**
			 * TO DO:
			 * 
			 * don't allow the first option of a list to be added to countSelections => 
			 * => first option should always be a descriptive text or indication like "please select" - << necesity and impact to be tested >>
			 */


			//trigger 'change' event when value of readonly input is changed programmatically
			var changeEvent = new Event('change');
			//if multiple choice...
			if(typeof target.getAttribute('data-multiple') !== 'object') {
				//add the selection to the array to keep track of what was selected
				//and add the posibility to remove a selection if clicked again
				var liClasses = this.getAttribute('class');
				// console.log(countSelections, val);
				if(countSelections.indexOf(val) === -1)
				{
					this.setAttribute('class', liClasses ? liClasses+' liSelected' : 'liSelected');
					countSelections.push(val);
					target.value = '';
					for(var i2=0; i2 < countSelections.length; i2++){
						target.value += countSelections[i2];
						if(i2 != countSelections.length-1)
						{
							target.value += '/ ';
						}
					}
					// console.log(countSelections);
					target.setAttribute('value', target.value);
					target.dispatchEvent(changeEvent);
				}
				else {
					this.className = this.className.replace(/\bliSelected\b/, '');
					countSelections.splice(countSelections.indexOf(val), 1);
					target.value = '';
					for(var j2=0; j2 < countSelections.length; j2++){
						target.value += countSelections[j2];
						if(j2 != countSelections.length-1)
						{
							target.value += '; ';
						}
					}
					target.setAttribute('value', target.value);
					target.dispatchEvent(changeEvent);
				}
				console.log(countSelections);
			}
			else {
				target.value = val;
				target.setAttribute('value', val);
				target.dispatchEvent(changeEvent);
			}
			
			if(target.value && target.parentElement.className.indexOf('active') == -1   )
			{
				target.parentElement.className = target.parentElement.className + ' active';
			}
			
		}
				
		//show/hide ul list
		if(ul.className.search(/\bopen\b/) != -1) //contine "open" => ascunde lista
		{
		// console.log('close list and remove event from data-multiple');
			ul.className = ul.className.replace(/[ ]*\bopen\b/, '');
			target.parentElement.className = target.parentElement.className.replace(/[ ]*\bopen\b/, '');
			if(!target.value)
			{
				target.parentElement.className = target.parentElement.className.replace(/\bactive\b/, '');
			}
			//if input has multiple selections attribute on
			if(target.getAttribute('data-multiple')) {
				// console.log("list replaced");
				/**
				 * because each time the input is clicked, the list of <li> (which is an object) will have a different reference,
				 * so it won't see the previous list with its events attached so no event to remove (because it existed on the object created in the previous input click),
				 * so, in order to remove the event setOption, the entire list should be removed and attached again on next input click
				 */
				//clone current ul node with all descendants and replace itself
				let ulClone = ul.cloneNode(true);
				target.parentElement.replaceChild(ulClone, ul);
			}
		}
		else
		{
		// console.log('open the list and attach click event');
			
			//retrieve the previous selections for this input 
			// countSelections = target.value ? target.value.split('/ ') : [];
			for( li of lis) {
				if(li.className.search(/\bliSelected\b/) !== -1) {
					countSelections.push(li.dataset.value);
				}
			}

			ul.className = ul.className + ' open';
			// if(!target.value)
				target.parentElement.className = target.parentElement.className + ' active';
			//open e pt arrow, active pt input value
			target.parentElement.className = target.parentElement.className + ' open';	
				for(let i3 = 1; i3 < lis.length; i3++)
				{
					
					lis[i3].addEventListener('click', setOption);
				}
			
			
		}		
			
		/*
				> blur se intampla inainte sa apuce sa se intample clickul
				pe li cand e deschis;
				> trebuie dat remove la event listener de pe lis cand se da click pe unul
				(ca sa nu se mai execute click pe el si cand e invizibil si dai click in zona lor)
		*/


		//handler-ul pt blur ar trebui setat separat si chemat removeEventListener, altfel se ataseaza de fiecare data cand se executa toggleList()
		function blurHandler(e){
			setTimeout(function(){
				//if input doesn't have 'data-multiple' attr (if it has multiple selection active, removing the click event would make it imposible to select a second or more options, so i choose to treat the toggle of list as the point for removing the click handlers from the <li> elements)
				if(typeof target.getAttribute('data-multiple') === 'object')
				{
					for(var i4 = 0; i4 < lis.length; i4++)
					{
						lis[i4].removeEventListener('click', setOption, false);
					};

					ul.className = ul.className.replace(/[ ]*open[ ]*/, ' ');
					target.parentElement.className = target.parentElement.className.replace(/[ ]*open[ ]*/, ' ');
				}
				if(!target.value)
					target.parentElement.className = target.parentElement.className.replace(/[ ]*active[ ]*/, ' ');
				
				e.target.removeEventListener('blur', blurHandler, false);
				
				console.log('blur');
			}, 250);   
				
		};
		target.addEventListener('blur', blurHandler); 
	}

	for(i = 0; i < selects.length; i++)
	{
		selects[i].querySelector('input').addEventListener('click', toggleList);
	};

	return letitfloat;
})();

//form label animations////////////////////////////////////////////////////////
var FloatLabel = (function() {
	
	// add active class and placeholder 
	var handleFocus = function(e) {
		var target = e.target;
		var placeholderLabel = document.querySelector('label[for='+target.getAttribute('id')+']');
		var placeholderText = placeholderLabel.getAttribute('data-placeholder');

		if(target.parentElement.className.indexOf('active') == -1)
		{
			target.parentElement.className = target.parentElement.className + ' active';
			if(placeholderText) target.setAttribute('placeholder',  placeholderText);
			};
		}
		
	
	// remove active class and placeholder
	var handleBlur = function(e) {
		var target = e.target;
		if(!target.value) { 
			target.parentElement.className = target.parentElement.className.replace(/[ ]*active[ ]*/, ' ');
		}
		target.removeAttribute('placeholder');    
	};  
	
	// register events
	var bindEvents = function(element) {
		var floatField = element.querySelector('.formField');
		
		floatField.addEventListener('focus', handleFocus);
		floatField.addEventListener('blur', handleBlur);  
	};
	
	// get DOM elements
	var init = function() {
		var floatContainers = document.querySelectorAll('.float-container');
		
		setTimeout(function() {
			for(var i = 0; i < floatContainers.length; i++)
			{
				
				if(floatContainers[i].querySelector('.formField').value)
				{
					floatContainers[i].classList.add('active');
				}
				
			
				bindEvents(floatContainers[i]);
			};
		}, 500);
	};
	
	return {
		init: init
	};
})();

FloatLabel.init();