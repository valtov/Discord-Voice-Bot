function extract_name(discord_attachment_url) {
  var subsets = discord_attachment_url.split('/');
  return subsets[subsets.length - 1];
}
const link = 'https://cdn.discordapp.com/attachments/669100761359187972/778026958683373628/UIFinal.mp3'

console.log(extract_name(link))