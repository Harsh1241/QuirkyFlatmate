// utils/generatePunishment.js
const generatePunishment = (complaintType) => {
  const punishments = {
    Noise: 'You owe everyone samosas for blasting loud music at 2 AM!',
    Cleanliness: 'You’re making chai for everyone for a week for not cleaning the dishes!',
    Bills: 'You’re paying the next month’s internet bill!',
    Pets: 'You’re cleaning the litter box for a month!',
    Other: 'You’re on dish duty for the next two weeks!',
  };

  return punishments[complaintType] || 'You owe everyone a treat!';
};

module.exports = generatePunishment;