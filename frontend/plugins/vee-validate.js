import Vue from 'vue'
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from 'vee-validate'
import { required, email, min, max, min_value, max_value, confirmed, alpha_num,image,size } from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/en.json'

Vue.component('VO', ValidationObserver)
Vue.component('VP', ValidationProvider)
setInteractionMode('eager')

extend('required', {
	...required,
	message: messages.required
})
extend('email', {
	...email,
	message: messages.email
})
extend('min', {
	...min,
	message: messages.min
})
extend('max', {
	...max,
	message: messages.max
})
extend('confirmed', {
	...confirmed,
	message: messages.confirmed
})
extend('image', {
	...image,
	message: messages.image
})
extend('size', {
	...size,
	message: messages.size
})