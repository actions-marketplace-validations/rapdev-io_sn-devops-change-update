const core = require('@actions/core');
const axios = require('axios');

(async function main() {
	const instanceName = core.getInput('instance-name', { required: true });
	const username = core.getInput('devops-integration-user-name', { required: true });
	const pass = core.getInput('devops-integration-user-pass', { required: true });
	const defaultHeaders = { 'Content-Type': 'application/json' };

	const changeNumber = core.getInput('change-number', { required: true });
	const changeState = core.getInput('change-state', { required: true });
	const changeResult = core.getInput('change-result', { required: true });

	const sncChangeUrl = `https://${username}:${pass}@${instanceName}.service-now.com/api/x_radi_ghact/devops/update_change/${changeNumber}`;
	

	let githubContext = core.getInput('context-github', { required: true })

	try {
	    githubContext = JSON.parse(githubContext);
	} catch (e) {
	    core.setFailed(`exception parsing github context ${e}`);
	}

	let changeBody = {
		'changeState': changeState,
		'changeResult': changeResult,
		'githubContext': githubContext
	}

	let response;

	core.info("changeUpdatePayload " + JSON.stringify(changeBody));
	
	try {
		response = await axios.post(sncChangeUrl, changeBody, defaultHeaders);
		console.log("ServiceNow Status: " + response.status + "; Response: " + JSON.stringify(response.data));
	} catch (e) {
		core.setFailed(`failed to update change ${e} \nResponse: ` + e.response);
		return
	}

})();