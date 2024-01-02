export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		// This can be in an "On Page Load" action
		storeValue('isNominationEnabled', false);

	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}