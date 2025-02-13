import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { forwardRef } from 'react';

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
    marginBottom: 32,
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
    fontSize: 10,
  },
  listItemContent: {
    flex: 1,
    fontSize: 10,
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
            <View key={index} style={{ marginBottom: 24 }}>
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
            <View key={index} style={{ marginBottom: 24 }}>
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{edu.institute_name}</Text>
                <Text>
                  {format(new Date(edu.start_date), 'MMMM yyyy')} -{' '}
                  {format(new Date(edu.end_date), 'MMMM yyyy')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
