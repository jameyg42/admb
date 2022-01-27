module.exports = {
    round: (v, dp) => Number(Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp))
}