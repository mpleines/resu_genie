import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: '/fonts/times-new-roman.ttf', fontWeight: 'normal' },
    { src: '/fonts/times-new-roman-bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/times-new-roman-italic.ttf', fontStyle: 'italic' },
    // {
    //   src: '/fonts/times-new-roman-bold-italic.ttf',
    //   fontWeight: 'bold',
    //   fontStyle: 'italic',
    // },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Times New Roman',
    fontSize: 12,
  },
  header: {
    marginTop: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 16,
  },
  experienceItem: {
    marginBottom: 24,
  },
  organizationName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  dates: {
    fontSize: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    fontSize: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
  },
  skills: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
});

export const MinimalisticResumeTemplate = ({ data, email }: any) => {
  const { personal_information, work_experience, summary, skills, education } =
    data;

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
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.organizationName}>
                {job.organisation_name}
              </Text>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.profile}</Text>
                <Text style={styles.dates}>
                  {format(new Date(job.start_date), 'MMMM yyyy')} -{' '}
                  {format(new Date(job.end_date), 'MMMM yyyy')}
                </Text>
              </View>
              {job.job_description?.map((detail, i) => (
                <View key={i} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{detail}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skills}>{skills?.join(', ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education?.map((edu, index) => (
            <View key={index} style={styles.educationItem}>
              <Text style={styles.organizationName}>{edu.institute_name}</Text>
              <Text style={styles.dates}>
                {format(new Date(edu.start_date), 'MMMM yyyy')} -{' '}
                {format(new Date(edu.end_date), 'MMMM yyyy')}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
