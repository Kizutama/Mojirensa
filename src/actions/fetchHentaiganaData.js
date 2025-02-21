
export async function fetchHentaiganaData() {
    const response = await fetch('/data/hentaigana_data_fixed.json');
    return await response.json();
}
