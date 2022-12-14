CREATE TABLE SPOILAGE_AGENT_TYPE(
	SPOILAGE_AGENT_TYPE_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    VALUE  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE SPOILAGE_AGENT(
	SPOILAGE_AGENT_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NAME  VARCHAR(100) NOT NULL UNIQUE,
    TYPE INT,
    FOREIGN KEY(TYPE) REFERENCES SPOILAGE_AGENT_TYPE(SPOILAGE_AGENT_TYPE_ID)
);

CREATE TABLE SPOILAGE_AGENT_MANAGEMENT(
	THEATRE_GOOD_ID INT,
    FOREIGN KEY(THEATRE_GOOD_ID) REFERENCES THEATRE_GOOD(THEATRE_GOOD_ID),
    SPOILAGE_AGENT_ID INT,
    FOREIGN KEY(SPOILAGE_AGENT_ID) REFERENCES SPOILAGE_AGENT(SPOILAGE_AGENT_ID),
    CONSTRAINT SPOILAGE_AGENT_MANAGEMENT_PK PRIMARY KEY (THEATRE_GOOD_ID, SPOILAGE_AGENT_ID),
    DetectionDate DATE NOT NULL
);