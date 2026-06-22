# SOP: Tour Calendar Event Creation

| Field | Detail |
|-------|--------|
| **SOP ID** | SOP-010 |
| **Version** | 1.0 |
| **Owner** | Operations |
| **Applies to** | KL & Penang tours |
| **Last updated** | 2026-05-22 |

---

## 1. Purpose

Standardise how tour bookings are recorded across the KL Calendar (`info@simplyenak.com`) and Penang Calendar (`penang@simplyenak.com`) so that any team member can look at the calendar and immediately answer:
- What tour is happening, when, and with whom
- Who the customer is and how to reach them
- Any dietary/accessibility requirements
- Who the guide is

---

## 2. Which Calendar to Use

| Tour location | Calendar |
|---------------|----------|
| Kuala Lumpur tours | KL Calendar (`info@simplyenak.com`) |
| Penang tours | Penang Calendar (`penang@simplyenak.com`) |

Do not cross-post. A George Town tour goes on the Penang Calendar. A KL Street Food tour goes on the KL Calendar.

---

## 3. Event Summary Format

### 3.1 Primary descriptive event

One event per booking. Create a single event with the actual tour start and end times.

**Format:**
```
[Private] Tour Name [N adults] (Guide Name)
```

**For bookings with children:**
```
[Private] Tour Name [N adults x N kids] (Guide Name)
```

**For join-in (non-private) tours:**
```
Tour Name [N adults] (Guide Name)
```
(no `[Private]` prefix)

**Examples:**
- `[Private] Secrets of KL [4 adults] (Jackie)` — private tour, 4 adults, guide is Jackie
- `Eat Drink George Town [2 adults] (Wei Shen)` — join-in tour, 2 adults, guide Wei Shen
- `[Private] Penang Street Food [2 adults x 1 child] (Ronald Wong)` — private tour with child
- `[Private] Flavours of Malaysia [6 adults] (Gary)` — private tour, 6 adults, guide Gary

---

## 4. Event Fields

### 4.1 Location (meeting point)

Enter the hotel or meeting point address where the guide will pick up the guests.

**Examples:**
- `The RuMa Hotel and Residences, 7, Jalan Kia Peng, Kuala Lumpur`
- `Eastern & Oriental Hotel, 10 Farquhar Street, George Town`
- `Kapitan Keling Mosque, 14, Lebuh Buckingham, George Town`
- `Mydin Emporium, 258, Penang Road, George Town`

### 4.2 Description (customer details)

Populate the description field with the following information. Use this template:

```
Customer name: [guest name] [N adults x N kids]
Customer telephone: [country code + number]

Dietary/Notes: [allergies, dietary restrictions, mobility concerns]

Booked by: [who took the booking] | [date/time]
```

**Examples:**

Simple booking:
```
Customer name: Chloe Berk [6 adults]
Customer telephone: 16195355243
Note: 1 vegetarian (Chloe)
```

Multi-party booking:
```
Customer name: Jon Fieldman [2 adults]
Customer telephone: 15109991945

Customer name: Jill Fedeski [2 adults]
Customer telephone: GB+44 07974 980058
Note: one of our party does not eat meat
```

Booking from EXO with guest names:
```
Mr. Nigel ROYFEE - Adult
Mrs Kathleen Pesek NIXON - Adult
Mr Matthew Fowler NIXON - Adult
Ms Kristen Marie PIGOTT - Adult
Note: Kristen: No cashews, pistachios, walnuts
```

### 4.3 Time (tour duration)

Set the event start and end time to match the actual tour duration (not fixed windows — use the real times the tour operates for that client).

| Tour | Typical duration |
|------|-----------------|
| Eat Drink George Town | 4 hours (e.g. 16:00–20:00) |
| Penang Street Food | 3h45 (e.g. 09:00–12:45) |
| Secrets of KL | 4 hours (e.g. 16:00–20:00) |
| Flavours of KL | 4 hours |
| Petaling Heritage Food Walk | 4 hours |

---

## 5. Multiple Guides or Swap Notes

When a guide swap or reassignment happens mid-booking, note it in the description:

```
=Swap Ronald to Wei Shen's tour, re-assign Wei Shen to Ronald's.
Take note: Pickup Blue Mansion

11:07am 14/1 | Pauline
```

Update the guide name in the event summary to reflect the final assignment.

---

## 6. Cancellations

Mark cancelled tours by prefixing the summary with `(CANCELLED)` or `[CANCELLED]`:

```
(CANCELLED) [Private] Eat Drink George Town [2 adults] (Gary)
```

Leave the event on the calendar (do not delete) and add the cancellation reason to the description:

```
Customer name: Deborah Ilife [2 adults]
Customer telephone: 447979858516
[CANCELLED]
```

For cancelled tours, also note who cancelled and why in the description footer:
```
8:15pm Jan. 11 | Trishia
CANCELLED: health issue
```

---

## 7. Joint-in Events with Multiple Bookings

When a join-in tour (non-private) has multiple parties from different bookings, list each as a separate customer block in the description:

```
Customer name: Sarah Reid [3 adults]
Customer telephone: 16043419134

Customer name: Caroline Hunt [1 adult]
Customer telephone: 14157287736

9:45am Mar. 13 | Maarten
8:15pm Jan. 11 | Trishia
```

---

## 8. Attachments

If the booking was made via email with a booking confirmation attachment, attach the PDF to the event. If the customer sent a screenshot of the payment or voucher, attach that too.

---

## 8. Checklist (Pre-Save)

- [ ] Correct calendar selected (KL vs Penang)
- [ ] Summary follows format: `[Private] Tour Name [N adults] (Guide)`
- [ ] Location field has hotel/meeting point address
- [ ] Description contains: customer name(s), telephone, dietary notes
- [ ] Times reflect actual tour duration
- [ ] Cancelled events marked with `(CANCELLED)` prefix, not deleted
- [ ] Guide name in summary matches actual assigned guide
