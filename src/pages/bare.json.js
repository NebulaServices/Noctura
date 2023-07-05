export async function get({params, request}) {
    return {
      body: JSON.stringify([
        'tomp.app',
        '198.251.90.207',
        'us-east.noctura.tech',
        'us-west.noctura.tech',
        'eu-central.noctura.tech'
      ]),
    };
  }