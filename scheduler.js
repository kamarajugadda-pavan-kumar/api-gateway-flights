const { DateTime } = require("luxon");

function YYYY_MM_DD_HH_MM_A__to__YYYY_MM_DD_HH_MM_SS(dateTime) {
  dateTime = DateTime.fromFormat(dateTime, "yyyy-MM-dd hh:mm a", {
    zone: "utc",
  });
  const utcTimestamp = dateTime.toUTC().toFormat("yyyy-MM-dd HH:mm:ss");

  return utcTimestamp;
}

class ScheduleCalculator {
  constructor(scheduleData) {
    this.scheduleId = scheduleData.scheduleId;
    this.businessId = scheduleData.businessId;
    this.timeZone = scheduleData.timeZone;
    this.startDate = scheduleData.startDate;
    this.startTime = scheduleData.startTime;
    this.start_AM_PM = scheduleData.start_AM_PM;
    this.startTimeStampUTC = this.getStartTimeStampUTC();
    this.endDate = scheduleData.endDate;
    this.endTime = scheduleData.endTime;
    this.end_AM_PM = scheduleData.end_AM_PM;
    this.endTimeStampUTC = this.getEndTimeStampUTC();
    this.recurrence = scheduleData.recurrence;
    this.repeatEvery = scheduleData.repeatEvery;
    this.occursOn = scheduleData.occursOn;
    this.next_schedule_time = this.calculateNextScheduleTime(
      scheduleData.next_schedule_time || this.startTimeStampUTC,
      scheduleData.next_schedule_time ? false : true
    )
      .toUTC()
      .toFormat("yyyy-MM-dd hh:mm a");
    this.payload = scheduleData.payload;
    this.no_of_fails = scheduleData.no_of_fails || 0;
    this.type = scheduleData.type || "callback";
    this.createdBy = scheduleData.createdBy;
    this.error_messages = scheduleData.error_messages || [];
  }

  createUTCTimestamp(date, time, AM_PM, timeZone) {
    if (time == "12:00" && AM_PM == "AM") time = "00:00";
    const combinedDateTime = `${date} ${time} ${AM_PM}`;
    const dateTime = DateTime.fromFormat(
      combinedDateTime,
      "yyyy-MM-dd hh:mm a",
      {
        zone: timeZone,
      }
    );
    const utcTimestamp = dateTime.toUTC().toFormat("yyyy-MM-dd hh:mm a");

    return utcTimestamp;
  }

  getStartTimeStampUTC() {
    return this.createUTCTimestamp(
      this.startDate,
      this.startTime,
      this.start_AM_PM,
      this.timeZone
    );
  }

  getEndTimeStampUTC() {
    return this.createUTCTimestamp(
      this.endDate,
      this.endTime,
      this.end_AM_PM,
      this.timeZone
    );
  }

  calculateNextScheduleTime(currentTime, isFirstSchedule = false) {
    currentTime = DateTime.fromFormat(currentTime, "yyyy-MM-dd hh:mm a", {
      zone: "utc",
    });
    let nextTime;
    switch (this.recurrence) {
      case "hourly":
        nextTime = this.calculateHourly(currentTime, isFirstSchedule);
        break;
      case "daily":
        nextTime = this.calculateDaily(currentTime, isFirstSchedule);
        break;
      case "weekly":
        nextTime = this.calculateWeekly(currentTime, isFirstSchedule);
        break;
      case "monthly":
        nextTime = this.calculateMonthly(currentTime, isFirstSchedule);
        break;
      default:
        throw new Error("Invalid recurrence type");
    }

    // Ensure the next time is in the future
    // while (nextTime <= currentTime) {
    //   nextTime = this.calculateNextScheduleTime(
    //     nextTime.plus({ minutes: 1 }).toUTC().toString(),
    //     false
    //   );
    // }

    return nextTime;
  }

  calculateMonthly(currentTime, isFirstSchedule) {
    let nextTime;

    if (typeof this.occursOn === "number") {
      nextTime = this.adjustToValidMonthDay(
        currentTime,
        this.occursOn,
        isFirstSchedule
      );
    }

    return nextTime;
  }

  adjustToValidMonthDay(dateTime, day, isFirstSchedule) {
    let convertedTime = dateTime.setZone(this.timeZone);

    const month = convertedTime.month;

    let targetMonth = isFirstSchedule
      ? month +
        (convertedTime >
        convertedTime.set({ day: Math.min(day, convertedTime.daysInMonth) })
          ? 1
          : 0)
      : month + this.repeatEvery;
    convertedTime = convertedTime.set({ month: targetMonth });

    const daysInMonth = convertedTime.daysInMonth;
    let targetDay = Math.min(daysInMonth, day);

    convertedTime = convertedTime.set({ day: targetDay });

    convertedTime = convertedTime.setZone("utc");

    // console.log(convertedTime, dateTime);
    return convertedTime;
  }

  getSchedule() {
    let res = {
      scheduleId: this.scheduleId,
      businessId: this.businessId,
      timeZone: this.timeZone,
      startDate: this.startDate,
      startTime: this.startTime,
      start_AM_PM: this.start_AM_PM,
      startTimeStampUTC: YYYY_MM_DD_HH_MM_A__to__YYYY_MM_DD_HH_MM_SS(
        this.startTimeStampUTC
      ),
      endDate: this.endDate,
      endTime: this.endTime,
      end_AM_PM: this.end_AM_PM,
      endTimeStampUTC: YYYY_MM_DD_HH_MM_A__to__YYYY_MM_DD_HH_MM_SS(
        this.endTimeStampUTC
      ),
      recurrence: this.recurrence,
      repeatEvery: this.repeatEvery,
      occursOn: JSON.stringify(this.occursOn),
      next_schedule_time: YYYY_MM_DD_HH_MM_A__to__YYYY_MM_DD_HH_MM_SS(
        this.next_schedule_time
      ),
      payload: this.payload,
      no_of_fails: this.no_of_fails,
      type: this.type,
      createdBy: this.createdBy,
      error_messages: JSON.stringify(this.error_messages),
    };

    return res;
  }
}

module.exports = ScheduleCalculator;

let parsedMessage = {
  businessId: 8,
  timeZone: "Asia/Calcutta",
  startDate: "2024-12-01",
  startTime: "12:00",
  start_AM_PM: "AM",
  endDate: "2025-01-31",
  endTime: "12:00",
  end_AM_PM: "AM",
  recurrence: "monthly",
  repeatEvery: 1,
  occursOn: 31,
  type: "callback",
  createdBy: 19,
  scheduleId: "21c63a6e-b1c4-4b36-8eec-441dc7324713",
  payload:
    '{"callbackName":"createTask","callbackArguments":[{"private":true,"isSignatureRequired":true,"attachmentsRequiredForCompletion":true,"geoFenceEnabled":true,"attachments":["Task/attachments/e7c988aa-8c9d-474e-a125-64847ec7776c_pexels-photo-610294.jpeg"],"taskImage":"","taskVideo":"","taskType":"0","geoFenceLatitude":17.43703,"geoFenceLongitude":78.4410784,"geoFenceRadius":100,"checklistData":[],"priority":"medium","userTags":[{"targetUserID":26,"taskUserType":"mentioned"},{"targetUserID":26,"taskUserType":"assigned"}],"locationTags":[],"departmentTags":[],"tagsList":[{"assenedTypeTags":[{"type":"User","userID":26,"firstName":"Puneeth","lastName":"B","email":"puneeth@yopmail.com","profilePic":"https://dev-th-imgs.s3.us-west-1.amazonaws.com/superadmin/attachments/08775ec3-7402-40cc-ac9a-e0a78a1b7510_pexels-photo-610294.jpeg","taskUserType":"assigned"}],"mensionTypeTags":[{"type":"User","userID":26,"firstName":"Puneeth","lastName":"B","email":"puneeth@yopmail.com","profilePic":"https://dev-th-imgs.s3.us-west-1.amazonaws.com/superadmin/attachments/08775ec3-7402-40cc-ac9a-e0a78a1b7510_pexels-photo-610294.jpeg","taskUserType":"mentioned"}]}],"geoFenceRadiusUnit":"meters","dueDate":"2024-10-07T11:30:00.383Z","startDate":"2024-10-07T05:40:00.000Z","taskDescription":"<p>Verify hourly task.</p>","staticCheckList":["Date"],"checklistLabels":[],"taskName":"Spects-hourly"},{"userID":19,"businessName":"Schools","status":1,"businessID":8,"role":"HQ","roleID":2,"otherBusinesses":[],"iat":1728279110,"exp":1728365510}]}',
};
for (let i = 0; i < 12; i++) {
  parsedMessage.next_schedule_time =
    parsedMessage.next_schedule_time &&
    DateTime.fromFormat(
      parsedMessage.next_schedule_time,
      "yyyy-MM-dd HH:mm:ss",
      { zone: "utc" }
    ).toFormat("yyyy-MM-dd hh:mm a");
  let schedule = new ScheduleCalculator(parsedMessage).getSchedule();
  parsedMessage.next_schedule_time = schedule.next_schedule_time;
  console.log(schedule.next_schedule_time);
}
