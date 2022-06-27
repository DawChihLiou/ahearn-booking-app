module.exports = {
    calculateException: function (exceptions, date, employee) {
        const index = exceptions.findIndex((item) => {

            return (
                (item.employee_ids.includes(employee.id) || item.allEmployees) &&
                new Date(item.validFrom).getTime() <= date.format("x") &&
                new Date(item.validUntil).getTime() >= date.format("x")
            )
        })
        if (index > -1) return true
        return false
    },

    calculateWeeklyClose: function (item, date, employee) {
        const settings = item.repeatSettings
        if (settings.days.includes(date.utc().day())) {
            const start = Number.parseInt(settings.start.hours.toString() + settings.start.minutes.toString())
            const end = Number.parseInt(settings.end.hours.toString() + settings.end.minutes.toString())
            const timeValue = Number.parseInt(date.format("H").toString() + date.format("mm").toString())

            if (start <= timeValue && end >= timeValue && !this.calculateException(item.exceptions, date, employee)) {
                return true
            }

        }
        return false;
    },

    /*
     * Check if a Time Window is Closed
     */
    isClosed: function (closedDays, date, employee) {

        const index = closedDays.findIndex((item) => {
            const isRelevant = (
                (item.employee_ids.includes(employee.id) || item.allEmployees) &&
                new Date(item.validFrom).getTime() <= date.format("x") &&
                new Date(item.validUntil).getTime() >= date.format("x")
            )
            if (isRelevant) {
                //  console.log(  moment(item.validFrom).utc() , moment(date).utc())
                if (!item.repeat) {
                    return item
                } else {
                    switch (item.repeatSettings.method) {
                        case 'weekly':
                            return (this.calculateWeeklyClose(item, date, employee)) ? item : false
                            break
                    }
                }
            }
            return false
        })
        if (index > -1) return closedDays[index]
        return false
    }
}
