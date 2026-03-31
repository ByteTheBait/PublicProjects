import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for Steinbeck's journey
const steinbeckIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom red marker for civil rights events
const civilRightsIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDEwLjQgMTIuNSAyOC41IDEyLjUgMjguNVMyNSAyMi45IDI1IDEyLjVDMjUgNS42IDE5LjQgMCAxMi41IDB6IiBmaWxsPSIjZGMyNjI2Ii8+PGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjciIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const SteinbeckMap = () => {
    const [map, setMap] = useState(null);

    const steinbeckStops = [
        {
            id: 1,
            name: "Sag Harbor, NY",
            coords: [40.9973, -72.2925],
            description: "Starting point of Steinbeck's journey in September 1960. He departed from his home in his custom camper truck named 'Rocinante' after Don Quixote's horse.",
            date: "September 1960"
        },
        {
            id: 2,
            name: "Maine Coast",
            coords: [44.3106, -68.7712],
            description: "Steinbeck traveled through New England, observing the fall colors and reconnecting with the American landscape. He noted the changing seasons and the beauty of coastal Maine.",
            date: "Early October 1960"
        },
        {
            id: 3,
            name: "Chicago, IL",
            coords: [41.8781, -87.6298],
            description: "Stopped in Chicago where he observed the energy of the Midwest. Steinbeck reflected on American cities and their role in the nation's identity.",
            date: "October 1960"
        },
        {
            id: 4,
            name: "Fargo, ND",
            coords: [46.8772, -96.7898],
            description: "In the northern plains, Steinbeck experienced the vast openness of the Dakotas and encountered local farmers. He was struck by the harshness and beauty of the landscape.",
            date: "October 1960"
        },
        {
            id: 5,
            name: "Great Falls, MT",
            coords: [47.5053, -111.3008],
            description: "Traveled through Montana where he marveled at the Rocky Mountains and Big Sky country. He spent time reflecting on the American West and its mythology.",
            date: "Late October 1960"
        },
        {
            id: 6,
            name: "Seattle, WA",
            coords: [47.6062, -122.3321],
            description: "Reached the Pacific Northwest and was impressed by the lush landscapes and the beauty of the region. Charley had a memorable encounter with bears in nearby wilderness.",
            date: "November 1960"
        },
        {
            id: 7,
            name: "Salinas, CA",
            coords: [36.6777, -121.6555],
            description: "Returned to his birthplace in California's Salinas Valley. This emotional homecoming allowed Steinbeck to reflect on how much had changed since his youth.",
            date: "November 1960"
        },
        {
            id: 8,
            name: "Texas",
            coords: [31.9686, -99.9018],
            description: "Traveled through the vastness of Texas, impressed by its size and the distinct Texan identity. He met locals and discussed their pride in their state.",
            date: "November 1960"
        },
        {
            id: 9,
            name: "New Orleans, LA",
            coords: [29.9511, -90.0715],
            description: "Witnessed the 'Cheerleaders' - white protesters harassing Black children during school desegregation. This disturbing scene became one of the most powerful passages in his book.",
            date: "November-December 1960"
        },
        {
            id: 10,
            name: "Sag Harbor, NY",
            coords: [40.9973, -72.2925],
            description: "Starting point of Steinbeck's journey in September 1960. He departed from his home in his custom camper truck named 'Rocinante' after Don Quixote's horse.",
            date: "September 1960"
        }
    ];

    const civilRightsEvents = [
        {
            id: 100,
            name: "Washington, D.C.",
            coords: [38.8899, -77.0091],
            description: "President Truman issued Executive Orders 9980 and 9981, desegregating the federal workforce and the U.S. Armed Forces. This landmark decision marked the beginning of federal government action against racial discrimination and set the stage for future civil rights legislation.",
            date: "July 26, 1948",
            title: "Desegregation of Armed Forces"
        },
        {
            id: 115,
            name: "Anniston & Birmingham, AL",
            coords: [33.6596, -85.8316],
            description: "Freedom Rides: Activists rode interstate buses into the segregated South to challenge non-enforcement of Supreme Court rulings. In Anniston, a bus was firebombed by a mob. In Birmingham, riders were brutally beaten. Despite violence, the rides continued, forcing federal intervention and ICC desegregation of interstate travel.",
            date: "May 1961",
            title: "Freedom Rides"
        },
        {
            id: 116,
            name: "Birmingham, AL",
            coords: [33.5186, -86.8104],
            description: "Birmingham Campaign: Led by MLK and SCLC, protesters including thousands of children faced fire hoses and police dogs. Commissioner Bull Connor's brutal tactics were broadcast nationwide, shocking Americans. The campaign resulted in desegregation agreements and helped build momentum for federal civil rights legislation.",
            date: "April-May 1963",
            title: "Birmingham Campaign"
        },
        //add malcom x assassination
        {
            id: 117,
            name: "Washington, D.C.",
            coords: [38.8893, -77.0502],
            description: "March on Washington: Over 250,000 people gathered at the Lincoln Memorial for jobs and freedom. Dr. Martin Luther King Jr. delivered his iconic 'I Have a Dream' speech, calling for an end to racism and equality for all Americans. The march was a pivotal moment that influenced the Civil Rights Act of 1964.",
            date: "August 28, 1963",
            title: "March on Washington"
        },
        {
            id: 118,
            name: "Washington, D.C.",
            coords: [38.8899, -77.0091],
            description: "Civil Rights Act of 1964: President Lyndon B. Johnson signed this landmark legislation that outlawed discrimination based on race, color, religion, sex, or national origin. It ended segregation in public places and banned employment discrimination, representing the most sweeping civil rights legislation since Reconstruction.",
            date: "July 2, 1964",
            title: "Civil Rights Act of 1964"
        },
        {
            id: 119,
            name: "Selma to Montgomery, AL",
            coords: [32.4074, -86.8272],
            description: "Selma to Montgomery Marches: Three marches protesting voting discrimination. 'Bloody Sunday' (March 7) saw state troopers brutally attack peaceful marchers on the Edmund Pettus Bridge. The violence shocked the nation. The successful third march, protected by federal troops, covered 54 miles and led directly to the Voting Rights Act.",
            date: "March 1965",
            title: "Selma to Montgomery Marches"
        },
        {
            id: 120,
            name: "Washington, D.C.",
            coords: [38.8899, -77.0091],
            description: "Voting Rights Act of 1965: Signed by President Johnson, this act prohibited racial discrimination in voting, outlawing literacy tests and other tactics used to disenfranchise Black voters. Federal examiners could register voters in areas with histories of discrimination. It resulted in dramatic increases in Black voter registration across the South.",
            date: "August 6, 1965",
            title: "Voting Rights Act of 1965"
        },
        {
            id: 101,
            name: "Topeka, KS",
            coords: [39.0473, -95.6752],
            description: "Brown v. Board of Education: The Supreme Court unanimously ruled that racial segregation in public schools was unconstitutional, overturning the 'separate but equal' doctrine established in Plessy v. Ferguson (1896). Chief Justice Earl Warren declared that separate educational facilities were inherently unequal.",
            date: "May 17, 1954",
            title: "Brown v. Board of Education"
        },
        {
            id: 102,
            name: "Money, MS",
            coords: [33.6329, -90.2842],
            description: "14-year-old Emmett Till was brutally murdered after allegedly whistling at a white woman. His killers were acquitted by an all-white jury despite overwhelming evidence. His mother's decision to hold an open-casket funeral, showing his mutilated body, galvanized the Civil Rights Movement and shocked the nation.",
            date: "August 28, 1955",
            title: "Murder of Emmett Till"
        },
        {
            id: 103,
            name: "Montgomery, AL",
            coords: [32.3668, -86.2999],
            description: "Rosa Parks refused to give up her seat to a white passenger on a Montgomery bus, leading to her arrest. This sparked the Montgomery Bus Boycott, led by Dr. Martin Luther King Jr., which lasted 381 days and resulted in the Supreme Court ruling that segregation on public buses was unconstitutional.",
            date: "December 1, 1955",
            title: "Rosa Parks & Montgomery Bus Boycott"
        },
        {
            id: 104,
            name: "Little Rock, AR",
            coords: [34.7465, -92.2896],
            description: "Nine African American students, known as the Little Rock Nine, were prevented from entering Central High School by Arkansas Governor Orval Faubus and an angry white mob. President Eisenhower federalized the Arkansas National Guard and sent the 101st Airborne Division to escort the students into school.",
            date: "September 4, 1957",
            title: "Little Rock Nine Crisis"
        },
        {
            id: 105,
            name: "Washington, D.C.",
            coords: [38.8899, -77.0091],
            description: "President Eisenhower signed the Civil Rights Act of 1957, the first civil rights legislation since Reconstruction. Though weakened by Southern senators, it created the Civil Rights Commission and the Civil Rights Division of the Justice Department to investigate voting rights violations.",
            date: "September 9, 1957",
            title: "Civil Rights Act of 1957"
        },
        {
            id: 106,
            name: "Greensboro, NC",
            coords: [36.0726, -79.7920],
            description: "The Original Sit-in: Four African American college freshmen—Ezell Blair Jr., David Richmond, Franklin McCain, and Joseph McNeil—sat down at the 'whites-only' lunch counter at the F.W. Woolworth store on South Elm Street. They were refused service but stayed until closing time, sparking a massive sit-in movement that spread to over 100 cities by the end of the year.",
            date: "February 1, 1960",
            title: "The Greensboro Four Sit-in"
        },
        {
            id: 107,
            name: "Nashville, TN",
            coords: [36.1627, -86.7816],
            description: "Organized Student Sit-ins: Following the Greensboro model, students led by Diane Nash, James Bevel, and John Lewis launched a highly organized, nonviolent sit-in campaign to desegregate downtown lunch counters. Despite facing violence, arrests, and the bombing of a black community leader's home, the protesters persisted, resulting in the desegregation of several downtown businesses by May 1960.",
            date: "February–May 1960",
            title: "Nashville Student Movement"
        },
        {
            id: 108,
            name: "Baton Rouge, LA",
            coords: [30.4515, -91.1871],
            description: "Southern University Sit-ins: Seven students from Southern University in Baton Rouge staged a sit-in at the Kress store lunch counter, which led to their arrest for breaching the peace. This event catalyzed a broader student movement in the Deep South, including a march to the Louisiana State Capitol by 3,500 students to protest the arrests, demonstrating that the sit-in movement was spreading beyond the Upper South.",
            date: "March 28, 1960",
            title: "Southern University Protests"
        },
        {
            id: 109,
            name: "Raleigh, NC",
            coords: [35.7796, -78.6382],
            description: "Founding of SNCC: Ella Baker, a veteran organizer with the Southern Christian Leadership Conference (SCLC), organized a meeting of student leaders from various sit-in movements at Shaw University. Out of this conference, the Student Nonviolent Coordinating Committee (SNCC) was formed to coordinate the growing, spontaneous, and decentralized student protests.",
            date: "April 15–17, 1960",
            title: "Birth of SNCC"
        },
        {
            id: 110,
            name: "Atlanta, GA",
            coords: [33.7490, -84.3880],
            description: "Martin Luther King Jr. Arrested: MLK was arrested along with 35 students during a sit-in at the segregated lunch counter in Rich's Department Store in downtown Atlanta. While other demonstrators were released, King was held and sentenced to four months of hard labor, a move that brought presidential candidates John F. Kennedy and Richard Nixon into the conflict, shifting the national spotlight toward the campaign.",
            date: "October 19, 1960",
            title: "King's Arrest in Atlanta"
        },
        {
            id: 111,
            name: "Tallahassee, FL",
            coords: [30.4383, -84.2807],
            description: "Following the arrest of two Florida A&M students who sat in the 'whites-only' section of a city bus, Black residents launched a bus boycott that lasted seven months. Led by Reverend C.K. Steele, this was one of the first successful bus boycotts after Montgomery.",
            date: "May 1956",
            title: "Tallahassee Bus Boycott"
        },
        {
            id: 112,
            name: "Clinton, TN",
            coords: [36.1034, -84.1313],
            description: "Clinton High School became the first public school in the South to integrate following Brown v. Board of Education. Twelve African American students, known as the Clinton 12, faced violent mobs and threats. The school was bombed in 1958 but rebuilt, symbolizing resilience against segregation.",
            date: "August 1956",
            title: "Clinton 12 School Integration"
        },
        {
            id: 113,
            name: "Atlanta, GA",
            coords: [33.7490, -84.3880],
            description: "Dr. Martin Luther King Jr., Ralph Abernathy, and other civil rights leaders founded the Southern Christian Leadership Conference (SCLC) to coordinate and support nonviolent direct action as a method of desegregating bus systems across the South.",
            date: "January 1957",
            title: "Founding of SCLC"
        },
        {
            id: 114,
            name: "Birmingham, AL",
            coords: [33.5186, -86.8104],
            description: "Reverend Fred Shuttlesworth's home was bombed on Christmas night by members of the Ku Klux Klan in retaliation for his aggressive desegregation efforts. Shuttlesworth survived and continued his civil rights activism, later playing a crucial role in the Birmingham Campaign of 1963.",
            date: "December 25, 1956",
            title: "Bombing of Shuttlesworth's Home"
        },
        {
            id: 115,
            coords: [40.5021, -73.5627],
            title: "Malcom X Assassination",
            description: "Malcolm X was assassinated on February 21, 1965, at the Audubon Ballroom in Manhattan while preparing to address the Organization of Afro-American Unity. Though three members of the Nation of Islam were initially convicted, a 2021 investigation led to the exoneration of two due to withheld evidence by the FBI and NYPD.",
            date: "February 21, 1965",
        },
        {
            id: 121,
            name: "Memphis, TN",
            coords: [35.1345, -90.0568],
            description: "Assassination of Dr. Martin Luther King Jr.: While supporting striking sanitation workers, Dr. King was shot and killed on the balcony of the Lorraine Motel by James Earl Ray. His death sparked riots in over 100 cities and marked a tragic turning point in the Civil Rights Movement. He was 39 years old.",
            date: "April 4, 1968",
            title: "Assassination of MLK Jr."
        },

    ];

    // Create route path from coordinates
    const routePath = steinbeckStops.map(stop => stop.coords);

    // Center of USA for initial view
    const center = [39.8283, -98.5795];

    return (
        <div className="w-full h-screen flex flex-col bg-amber-50">
            <div className="bg-gradient-to-r from-amber-800 to-orange-700 text-white p-6 shadow-lg">
                <h1 className="text-4xl font-bold mb-2">Civil Rights Movement & Steinbeck's America</h1>
                <p className="text-lg opacity-90">1948-1965: The Fight for Equality Alongside Steinbeck's 1960 Journey</p>
                <p className="text-sm mt-2 opacity-75">Click on markers to explore Steinbeck's journey (blue) and pivotal Civil Rights events (red) from 1948-1965</p>
            </div>

            <div className="flex-1 relative">
                <MapContainer
                    center={center}
                    zoom={4}
                    className="w-full h-full"
                    whenCreated={setMap}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Steinbeck's route line */}
                    <Polyline
                        positions={routePath}
                        color="#0284c7"
                        weight={3}
                        opacity={0.6}
                        dashArray="10, 10"
                    />

                    {/* Markers for Steinbeck's stops */}
                    {steinbeckStops.map((stop) => (
                        <Marker
                            key={stop.id}
                            position={stop.coords}
                            icon={steinbeckIcon}
                        >
                            <Popup maxWidth={350}>
                                <div className="p-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <h3 className="text-xl font-bold text-blue-900">
                                            {stop.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm font-semibold text-blue-700 mb-2">
                                        {stop.date}
                                    </p>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {stop.description}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Markers for Civil Rights events */}
                    {civilRightsEvents.map((event) => (
                        <Marker
                            key={event.id}
                            position={event.coords}
                            icon={civilRightsIcon}
                        >
                            <Popup maxWidth={350}>
                                <div className="p-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                        <h3 className="text-xl font-bold text-red-900">
                                            {event.title}
                                        </h3>
                                    </div>
                                    <h4 className="text-lg font-semibold text-red-800 mb-1">
                                        {event.name}
                                    </h4>
                                    <p className="text-sm font-semibold text-red-700 mb-2">
                                        {event.date}
                                    </p>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-xl p-4 z-[1000] max-w-xs">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Map Legend</h3>

                    <div className="mb-3 pb-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Steinbeck's Journey</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-1 bg-blue-600" style={{opacity: 0.6}}></div>
                            <span className="text-sm text-gray-700">Travel Route</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" className="w-4" alt="marker"/>
                            <span className="text-sm text-gray-700">Journey Stops</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Civil Rights Movement 1960</h4>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                            <span className="text-sm text-gray-700">Key Events</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                        Map shows Civil Rights Movement 1948-1965 and Steinbeck's 1960 journey
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SteinbeckMap;