{
    var dateFormat = "YYYY/MM/DD";

    function timeProvider() {
        return options.timeProvider;
    }

    function now() {
        return moment(timeProvider().getCurrentDate());
    }

    function isToday(dayOfWeek) {
        var dayOfWeekDate = now().day(dayOfWeek);
        return !dayOfWeekDate.isBefore(now(), 'day') && !dayOfWeekDate.isAfter(now(), 'day');
    }

    function dateOfPrevious(dayOfWeek) {
        var dayOfWeekDate = now().day(dayOfWeek);
        if (!dayOfWeekDate.isBefore(now(), 'day')) {
            dayOfWeekDate.subtract('days', 7);
        }
        return dayOfWeekDate;
    }

    function dateOfNext(dayOfWeek) {
        var dayOfWeekDate = now().day(dayOfWeek);
        if (!dayOfWeekDate.isAfter(now(), 'day')) {
            dayOfWeekDate.add('days', 7);
        }
        return dayOfWeekDate;
    }

    function resultMergedFrom(left, right) {
        for (var key in right) {
        left[key] = right[key];
        }
        return left;
    }
}

WorkLogEntry
    = workload:WorkloadClause SPACE projectAndDate:ProjectAndDateClauses
        {
            return resultMergedFrom(workload, projectAndDate);
        }
    / project:ProjectsClause SPACE workloadAndDate:WorkloadAndDateClauses
        {
            return resultMergedFrom(project, workloadAndDate);
        }
    / date:DateClause SPACE workloadAndProject:WorkloadAndProjectClauses
        {
            return resultMergedFrom(workloadAndProject, date);
        }
    / projectAndDate:ProjectAndDateClauses
        {
            return resultMergedFrom(projectAndDate, {
                workload: "1d"
            });
        }
    / workloadAndProject:WorkloadAndProjectClauses
        {
            return resultMergedFrom(workloadAndProject, {
                day: now().format(dateFormat)
            });
        }
    / project:ProjectsClause
        {
            return resultMergedFrom(project, {
                workload: "1d",
                day: now().format(dateFormat)
            });
        }

WorkloadAndDateClauses
    = workload:WorkloadClause SPACE date:DateClause
        {
            return resultMergedFrom(workload, date);
        }
    / date:DateClause SPACE workload:WorkloadClause
        {
            return resultMergedFrom(workload, date);
        }

ProjectAndDateClauses
    = project:ProjectsClause SPACE date:DateClause
        {
            return resultMergedFrom(project, date);
        }
    / date:DateClause SPACE project:ProjectsClause
        {
            return resultMergedFrom(project, date);
        }

WorkloadAndProjectClauses
    = workload:WorkloadClause SPACE project:ProjectsClause
        {
            return resultMergedFrom(workload, project);
        }
    / project:ProjectsClause SPACE workload:WorkloadClause
        {
            return resultMergedFrom(workload, project);
        }

WorkloadClause
    = workload:WorkloadInDays { return { workload: workload }; }
    / workload:WorkloadInHours { return { workload: workload }; }
    / workload:WorkloadInMinutes { return { workload: workload }; }

WorkloadInDays
    = days:Days SPACE_OPT hours:WorkloadInHours { return days + " " + hours; }
    / days:Days SPACE_OPT minutes:WorkloadInMinutes { return days + " " + minutes; }
    / Days

WorkloadInHours 
    = hours:Hours SPACE_OPT minutes:WorkloadInMinutes { return hours + " " + minutes; }
    / Hours

WorkloadInMinutes 
    = Minutes

Days
    = $(NUMBER "d")

Hours
    = $(NUMBER "h")

Minutes
    = $(NUMBER "m")

ProjectsClause
    = projectNames:ProjectClause+ { return {projectNames: projectNames}; }

ProjectClause
    = SPACE_OPT "#" projectName:WORD { return projectName; }

DateClause
    = "@" date:DateDefinition { return {day: date}; }

DateDefinition
    = dayOfWeek:DayOfWeek
        {
            return isToday(dayOfWeek)
                ? now().format(dateFormat)
                : dateOfPrevious(dayOfWeek).format(dateFormat);
        }
    / "last-" dayOfWeek:DayOfWeek
        {
            return dateOfPrevious(dayOfWeek).format(dateFormat);
        }
    / "next-" dayOfWeek:DayOfWeek
        {
            return dateOfNext(dayOfWeek).format(dateFormat);
        }
    / date:Date
        {
            if (moment(date, dateFormat).isValid()) {
                return moment(date, dateFormat).format(dateFormat);
            } else {
                error("Not a valid date");
            }
        }
    / relativeDay:RelativeDay
        {
            relativeDay = relativeDay.toLowerCase();
            var relativeDayDate = now();
            if (relativeDay === "yesterday") {
                relativeDayDate.subtract('days', 1);
            } else if (relativeDay === "tomorrow") {
                relativeDayDate.add('days', 1);
            }
            return relativeDayDate.format(dateFormat);
        }
    / DateOffset

DayOfWeek
    = $([Mm] "onday" / [Tt] "uesday" / [Ww] "ednesday" / [Tt] "hursday" / [Ff] "riday" / [Ss] "aturday" / [Ss] "unday")

Date
    = $(Year "/" Month "/" Day)

Year
    = NON_ZERO_DIGIT DIGIT DIGIT DIGIT

Month
    = [01] DIGIT / NON_ZERO_DIGIT

Day
    = [0-3] DIGIT / NON_ZERO_DIGIT

RelativeDay
    = $([Yy] "esterday" / [Tt] "oday" / [Tt] "omorrow")

DateOffset
    = "t" offsetSign:[+-] offset:NUMBER
        {
            var daysToAdd = offsetSign + offset;
            return now().add('days', daysToAdd).format(dateFormat)
        }

SPACE
    = " "+

SPACE_OPT
    = " "*

WORD
    = $([^ ]+)

NUMBER
    = $(NON_ZERO_DIGIT DIGIT*) / DIGIT

DIGIT
    = [0-9]

NON_ZERO_DIGIT
    = [1-9]
