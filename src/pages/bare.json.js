export async function get({params, request}) {
    return {
      body: JSON.stringify([
        'tomp.app',
        'us-east.noctura.tech',
        'us-west.noctura.tech',
        'eu-central.noctura.tech'
      ]),
    };
  }