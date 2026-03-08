🇬🇧 PROJECT REQUIREMENTS DOCUMENT (PRD) – Trash2Treasure

Version: 1.0.0
Date: March 6, 2026
Author: Ismael Marot


---

1. OVERVIEW

ReciclaApp is an application designed to connect people who have recyclable materials or donations available with individuals who collect these resources. Currently, many useful materials such as boxes, cans, bottles, clothing, or furniture end up on streets or sidewalks, making it difficult and time-consuming for collectors to find them randomly.

Our solution is a simple platform that allows any user to publish the exact location of these materials using GPS and interactive maps, making it easier for collectors to find them without wasting time. In addition, we encourage collaboration and gratitude between users to create a trustworthy and active community.

The target audience includes vulnerable individuals dedicated to collecting recyclable materials, as well as neighbors and business owners interested in donating or helping, who have access to mobile devices or the web.


---

2. OBJECTIVES AND SUCCESS CRITERIA

The main purpose of ReciclaApp is to optimize the process of collecting recyclable materials and donations, reducing time wasted in searching and promoting a supportive network among users.

Generate at least 10 active posts per day to validate the use and usefulness of the MVP.

Achieve that 50% of users return to the app the following week to encourage retention.

Ensure that more than 70% of visited posts receive a rating, promoting interaction and trust.

Ensure that at least half of active users receive and open push notifications, keeping them informed and connected.

Encourage users to save an average of 3 favorite locations, helping them organize and revisit opportunities.

Ensure that loading time on mobile devices is less than 2 seconds, providing a smooth user experience.


---

3. KEY FEATURES AND REQUIREMENTS

These are the main functionalities that will enable the proposed experience, ordered by priority:

Location posting:
Users will be able to indicate where materials are available with GPS support and an interactive map. Posts must include 1 to 3 photos, description, publishing user, rating, timestamp, and a timer of up to 24 hours to keep the information up to date.

Advanced filtering and search:
Allows searching posts by category (cardboard, cans, furniture, etc.), geographic proximity, or keywords, enabling quick access to relevant items.

Integrated navigation:
Guides collectors from their current location to the place where materials are located using GPS.

Scoring and appreciation:
Users can rate posts and send thanks, creating a reliable and motivating reputation system.

Push notifications:
Notify nearby users about new posts so they do not miss nearby opportunities.

Favorites:
Users can save locations of interest to review them later.

Personal statistics:
Users who publish posts can view their activity, ratings, and received thanks, encouraging participation.

General app report:
Displays global metrics such as number of contributors, posts, and categories.

Simple chat (optional):
Allows users to coordinate material pickup, making logistics easier.

User examples:

As a collector, I want to see on the map where materials are located so I don’t waste time searching.

As a donor, I want to upload photos and the location of materials I no longer use so I can help others.

As a user, I want to rate and thank posts to promote trust in the community.

As a collector, I want to filter materials by category to easily find what I need.

As a user, I want to receive notifications about nearby materials so I do not miss opportunities.


---

4. CONSTRAINTS AND ASSUMPTIONS

The application must primarily function on mobile devices, with web support for accessibility.

As an MVP, the database will be SQLite for simplicity, although PostgreSQL is considered for future scaling.

We assume that users will have internet access most of the time, although the PWA will offer partial offline functionality.

Basic login via email/password will be required; Google and Facebook will be additional options.

The app will depend on external map APIs (Google Maps or Mapbox) which must be available for navigation and geolocation.

Technical and human resources are limited to a small team, prioritizing simplicity and fast development.


---

5. DEPENDENCIES AND KEY ACTORS

Technical teams:
Frontend development (React for web and PWA), backend (Node.js and Express), and database management.

External providers:
GPS map services (Google Maps or Mapbox) and deployment platforms (Vercel or Netlify).

End users:
Vulnerable individuals who collect materials, neighbors, and businesses that donate items.

Internal stakeholders:
Product, marketing, and support teams responsible for deploying and promoting the app.


---

6. ROADMAP AND MILESTONES

To launch the MVP within a reasonable timeframe, the following plan is proposed:

    Month 1:
        Design and prototyping (wireframes and a simple mobile-friendly visual style).

    Month 2:
        Development of core features: posting, map, and search.

    Month 3:
        Implementation of scoring, notifications, and user system.

    Month 4:
        Pilot testing with real users and final adjustments.

    Month 5:
        Official launch and monitoring of initial metrics.

7. CONCLUSION

ReciclaApp represents a real opportunity to improve the management of recyclable materials and donations within the community, helping those who need it most optimize their time and effort. With a simple, accessible, and collaborative experience, we aim to build a trustworthy and active network that benefits all participants.

The next steps are to validate the design and begin MVP development, ensuring that the core functionalities meet the defined objectives and deliver value from the very beginning.