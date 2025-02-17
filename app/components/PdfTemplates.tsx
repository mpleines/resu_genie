import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: '/fonts/times-new-roman.ttf', fontWeight: 'normal' },
    { src: '/fonts/times-new-roman-bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/times-new-roman-italic.ttf', fontStyle: 'italic' },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 24,
    fontFamily: 'Times New Roman',
    fontSize: 12,
  },
  header: {
    marginTop: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  jobTitle: {
    fontWeight: 'bold',
  },
  jobDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobDescription: {
    marginTop: 8,
    marginLeft: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 10,
  },
  listItemContent: {
    flex: 1,
  },
});

export const MinimalisticResumeTemplate = (props, ref) => {
  const {
    data: { personal_information, work_experience, summary, skills, education },
    email,
  } = props;

  const contactInfo = [
    personal_information?.address,
    personal_information?.phone_1,
    email,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personal_information?.name}</Text>
          <Text style={styles.contactInfo}>{contactInfo}</Text>
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{summary}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {work_experience?.map((job, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.jobTitle}>{job.organisation_name}</Text>
              <View style={styles.jobDetails}>
                <Text style={{ fontStyle: 'italic' }}>{job.profile}</Text>
                <Text>
                  {format(new Date(job.start_date), 'MMMM yyyy')} -{' '}
                  {format(new Date(job.end_date), 'MMMM yyyy')}
                </Text>
              </View>
              <View style={styles.jobDescription}>
                {job.job_description?.map((detail, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listItemContent}>{detail}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text>{skills?.join(', ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education?.map((edu, index) => (
            <View key={index}>
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{edu.institute_name}</Text>
                <Text>
                  {format(new Date(edu.start_date), 'MMMM yyyy')} -{' '}
                  {format(new Date(edu.end_date), 'MMMM yyyy')}
                </Text>
              </View>
              <View>
                <Text>{edu.degree}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/roboto-regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/roboto-bold.ttf', fontWeight: 'bold' },
  ],
});

const professionalStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 24,
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#4a4a4a',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#d3d3d3',
    paddingBottom: 12,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  text: {
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 4,
  },
  skill: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#666666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  link: {
    color: '#1a0dab',
    textDecoration: 'none',
  },
});

export const ProfessionalResumeTemplate = ({ data, email }) => {
  const { personal_information, work_experience, summary, skills, education } =
    data;

  return (
    <Document>
      <Page size="A4" style={professionalStyles.page}>
        <View style={professionalStyles.header}>
          <Text style={professionalStyles.name}>
            {personal_information.name}
          </Text>
          {/* Uncomment and replace with actual job title if available */}
          {/* <Text style={styles.text}>Job Title Here</Text> */}
          <View style={professionalStyles.contactInfo}>
            {email && (
              <View style={professionalStyles.contactItem}>
                <Text>Email: </Text>
                <Link src={`mailto:${email}`} style={professionalStyles.link}>
                  {email}
                </Link>
              </View>
            )}
            {personal_information.phone_1 && (
              <View style={professionalStyles.contactItem}>
                <Text>Phone: {personal_information.phone_1}</Text>
              </View>
            )}
            {personal_information.address && (
              <View style={professionalStyles.contactItem}>
                <Text>Address: {personal_information.address}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={professionalStyles.section}>
          <Text style={professionalStyles.sectionTitle}>Summary</Text>
          <Text style={professionalStyles.text}>{summary}</Text>
        </View>

        <View style={professionalStyles.section}>
          <Text style={professionalStyles.sectionTitle}>Experience</Text>
          {work_experience?.map((job, index) => (
            <View
              key={index}
              style={{
                marginBottom: 16,
              }}
            >
              <View style={professionalStyles.text}>
                <Text style={{ fontWeight: 'bold' }}>
                  {job.organisation_name}
                </Text>{' '}
                <Text>
                  {job.profile} ({format(new Date(job.start_date), 'MMMM yyyy')}{' '}
                  - {format(new Date(job.end_date), 'MMMM yyyy')})
                </Text>
              </View>
              <View style={{ marginLeft: 16 }}>
                {job.job_description?.map((detail, i) => (
                  <Text key={i} style={professionalStyles.listItem}>
                    • {detail}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={professionalStyles.section}>
          <Text style={professionalStyles.sectionTitle}>Education</Text>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View style={professionalStyles.text}>
                <Text style={{ fontWeight: 'bold' }}>{edu.institute_name}</Text>{' '}
                <Text>
                  {edu.degree} ({format(new Date(edu.start_date), 'MMMM yyyy')}{' '}
                  - {format(new Date(edu.end_date), 'MMMM yyyy')})
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={professionalStyles.section}>
          <Text style={professionalStyles.sectionTitle}>Skills</Text>
          <View style={professionalStyles.flexRow}>
            {skills.map((skill, index) => (
              <Text key={index} style={professionalStyles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const modernCreativeStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 24,
    fontFamily: 'Roboto',
    color: '#333333',
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#cccccc',
    paddingBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f4e79',
  },
  jobTitle: {
    fontSize: 18,
    color: '#1f4e79',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f4e79',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  listItem: {
    marginBottom: 4,
  },
  skill: {
    fontSize: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1f4e79',
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
});

export const ModernCreativeResumePDF = (props, ref) => {
  const {
    data: { personal_information, work_experience, summary, skills, education },
    email,
  } = props;

  return (
    <Document ref={ref}>
      <Page size="A4" style={modernCreativeStyles.page}>
        <View style={modernCreativeStyles.header}>
          <View>
            <Text style={modernCreativeStyles.name}>
              {personal_information.name}
            </Text>
            <Text style={modernCreativeStyles.title}>
              Senior Software Engineer
            </Text>
          </View>
          <View style={modernCreativeStyles.contact}>
            <View>
              <Text>{email}</Text>
            </View>
            {personal_information.phone_1 && (
              <View>
                <Text>{personal_information.phone_1}</Text>
              </View>
            )}
            {personal_information.address && (
              <View>
                <Text>{personal_information.address}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={modernCreativeStyles.section}>
          <Text style={modernCreativeStyles.sectionTitle}>Summary</Text>
          <Text style={modernCreativeStyles.text}>{summary}</Text>
        </View>

        <View style={modernCreativeStyles.section}>
          <Text style={modernCreativeStyles.sectionTitle}>Experience</Text>
          <View style={modernCreativeStyles.timeline}>
            {work_experience.map((experience, index) => (
              <View key={index}>
                <View style={modernCreativeStyles.timelineDot} />
                <Text style={modernCreativeStyles.text}>
                  {experience.organisation_name}
                </Text>
                <Text style={modernCreativeStyles.text}>
                  {experience.profile} (
                  {new Date(experience.start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {experience.end_date
                    ? new Date(experience.end_date).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )
                    : 'Present'}
                  )
                </Text>
                <View>
                  {experience.job_description?.map((description, i) => (
                    <Text key={i} style={modernCreativeStyles.listItem}>
                      - {description}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={modernCreativeStyles.section}>
          <Text style={modernCreativeStyles.sectionTitle}>Education</Text>
          <View style={modernCreativeStyles.timeline}>
            {education.map((edu, index) => (
              <View key={index}>
                <View style={modernCreativeStyles.timelineDot} />
                <Text style={modernCreativeStyles.text}>{edu.degree}</Text>
                <Text style={modernCreativeStyles.text}>
                  {edu.institute_name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={modernCreativeStyles.section}>
          <Text style={modernCreativeStyles.sectionTitle}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {skills.map((skill, index) => (
              <Text key={index} style={modernCreativeStyles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
