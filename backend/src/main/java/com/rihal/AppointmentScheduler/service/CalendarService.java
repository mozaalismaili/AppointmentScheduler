package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.dto.*;
import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    private final AppointmentRepository repo;

    public CalendarService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public CalendarResponse<DayBucketDTO> daily(UUID providerId, LocalDate start, LocalDate end, boolean includeCancelled) {
        List<Appointment> data = repo.findByProviderIdAndDateBetween(providerId, start, end);
        List<Appointment> filtered = includeCancelled ? data
                : data.stream().filter(a -> a.getStatus() == Appointment.Status.BOOKED).toList();

        Map<LocalDate, List<Appointment>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(Appointment::getDate, TreeMap::new, Collectors.toList()));

        Map<String, DayBucketDTO> buckets = new LinkedHashMap<>();
        for (Map.Entry<LocalDate, List<Appointment>> e : grouped.entrySet()) {
            DayBucketDTO b = new DayBucketDTO();
            b.date = e.getKey();
            b.items = e.getValue().stream().map(this::toDto).toList();
            b.total = b.items.size();
            buckets.put(e.getKey().toString(), b);
        }

        CalendarResponse<DayBucketDTO> resp = new CalendarResponse<>();
        resp.providerId = providerId;
        resp.rangeStart = start;
        resp.rangeEnd = end;
        resp.total = filtered.size();
        resp.buckets = buckets;
        return resp;
    }

    public CalendarResponse<WeekBucketDTO> weekly(UUID providerId, LocalDate start, LocalDate end, boolean includeCancelled, Locale locale) {
        WeekFields wf = WeekFields.of(locale == null ? Locale.US : locale); // ISO weeks with Locale control
        List<Appointment> data = repo.findByProviderIdAndDateBetween(providerId, start, end);
        List<Appointment> filtered = includeCancelled ? data
                : data.stream().filter(a -> a.getStatus() == Appointment.Status.BOOKED).toList();

        record WeekKey(int weekYear, int week) {}
        Function<Appointment, WeekKey> keyFn = a -> {
            LocalDate d = a.getDate();
            return new WeekKey(d.get(wf.weekBasedYear()), d.get(wf.weekOfWeekBasedYear()));
        };

        Map<WeekKey, List<Appointment>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(keyFn, TreeMap::new, Collectors.toList()));

        Map<String, WeekBucketDTO> buckets = new LinkedHashMap<>();
        for (Map.Entry<WeekKey, List<Appointment>> e : grouped.entrySet()) {
            WeekKey k = e.getKey();
            LocalDate weekStart = LocalDate
                    .now()
                    .withYear(k.weekYear)
                    .with(wf.weekOfWeekBasedYear(), k.week)
                    .with(wf.dayOfWeek(), 1); // Monday
            LocalDate weekEnd = weekStart.plusDays(6);

            WeekBucketDTO b = new WeekBucketDTO();
            b.weekYear = k.weekYear;
            b.week = k.week;
            b.start = weekStart;
            b.end = weekEnd;
            b.items = e.getValue().stream().map(this::toDto).toList();
            b.total = b.items.size();

            String key = k.weekYear + "-W" + String.format("%02d", k.week);
            buckets.put(key, b);
        }

        CalendarResponse<WeekBucketDTO> resp = new CalendarResponse<>();
        resp.providerId = providerId;
        resp.rangeStart = start;
        resp.rangeEnd = end;
        resp.total = filtered.size();
        resp.buckets = buckets;
        return resp;
    }

    public CalendarResponse<MonthBucketDTO> monthly(UUID providerId, LocalDate start, LocalDate end, boolean includeCancelled) {
        List<Appointment> data = repo.findByProviderIdAndDateBetween(providerId, start, end);
        List<Appointment> filtered = includeCancelled ? data
                : data.stream().filter(a -> a.getStatus() == Appointment.Status.BOOKED).toList();

        Map<YearMonth, List<Appointment>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(a -> YearMonth.from(a.getDate()), TreeMap::new, Collectors.toList()));

        Map<String, MonthBucketDTO> buckets = new LinkedHashMap<>();
        for (Map.Entry<YearMonth, List<Appointment>> e : grouped.entrySet()) {
            MonthBucketDTO b = new MonthBucketDTO();
            b.month = e.getKey();
            b.items = e.getValue().stream().map(this::toDto).toList();
            b.total = b.items.size();
            buckets.put(e.getKey().toString(), b); // "2025-08"
        }

        CalendarResponse<MonthBucketDTO> resp = new CalendarResponse<>();
        resp.providerId = providerId;
        resp.rangeStart = start;
        resp.rangeEnd = end;
        resp.total = filtered.size();
        resp.buckets = buckets;
        return resp;
    }

    private AppointmentDTO toDto(Appointment a) {
        AppointmentDTO d = new AppointmentDTO();
        d.id = a.getId();
        d.customerId = a.getCustomerId();
        d.providerId = a.getProviderId();
        d.date = a.getDate();
        d.startTime = a.getStartTime();
        d.endTime = a.getEndTime();
        d.status = a.getStatus().name();
        return d;
    }
}
