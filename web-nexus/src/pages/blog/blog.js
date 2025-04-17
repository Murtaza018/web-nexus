import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  Tag,
  MessageSquare,
  Edit,
  Trash2,
  Lock,
  Send,
} from "lucide-react";
import "./blog.css";

const initialJournalEntries = [
  {
    id: 1,
    title: "First Day of Spring",
    content:
      "Today the flowers started blooming in our garden. Sarah and I spent the afternoon planting new seeds.",
    date: "2025-03-20",
    theme: "Nature",
    author: "Mom",
    comments: [
      {
        id: 1,
        author: "Dad",
        text: "The garden looks beautiful!",
        timestamp: "2025-03-20T18:30:00",
      },
      {
        id: 2,
        author: "Emma",
        text: "Can't wait to see the tulips bloom!",
        timestamp: "2025-03-21T09:15:00",
      },
    ],
  },
  {
    id: 2,
    title: "Jake's Soccer Championship",
    content:
      "Jake's team won the regional championship today! He scored the winning goal in the last minute.",
    date: "2025-04-12",
    theme: "Sports",
    author: "Dad",
    comments: [
      {
        id: 1,
        author: "Mom",
        text: "So proud of you, Jake!",
        timestamp: "2025-04-12T19:45:00",
      },
    ],
  },
];

// Family members list for access control
const familyMembers = [
  "Mom",
  "Dad",
  "Jake",
  "Emma",
  "Grandma",
  "Grandpa",
  "aneeq",
];

export default function FamilyJournal() {
  const [entries, setEntries] = useState(initialJournalEntries);
  const [themes, setThemes] = useState([
    "Nature",
    "Sports",
    "Travel",
    "Celebration",
    "Milestone",
  ]);
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentUser, setCurrentUser] = useState({
    firstname: "Dad",
    lastname: "Raza",
    username: "araza-29",
    password: "aloomian",
  });
  useEffect(() => {
    const storedUserDataString = localStorage.getItem("user");
    let userData = null;
    if (storedUserDataString) {
      try {
        userData = JSON.parse(storedUserDataString);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    theme: "",
    date: "",
  });
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [activeEntryForComment, setActiveEntryForComment] = useState(null);

  // Filter entries based on search, theme, and date
  const filterEntries = () => {
    let filtered = [...entries];

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTheme) {
      filtered = filtered.filter((entry) => entry.theme === selectedTheme);
    }

    if (selectedDate) {
      filtered = filtered.filter((entry) => entry.date === selectedDate);
    }

    setFilteredEntries(filtered);
  };

  // Handle input change for entry form
  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Save a new or edited entry
  const saveEntry = () => {
    if (editingEntryId) {
      // Update existing entry
      const updatedEntries = entries.map((entry) =>
        entry.id === editingEntryId
          ? { ...entry, ...newEntry, author: currentUser.firstname }
          : entry
      );
      setEntries(updatedEntries);
      setFilteredEntries(updatedEntries);
    } else {
      // Add new entry
      const entry = {
        id: entries.length + 1,
        ...newEntry,
        author: currentUser.firstname,
        date: newEntry.date || new Date().toISOString().split("T")[0],
        comments: [],
      };
      const updatedEntries = [...entries, entry];
      setEntries(updatedEntries);
      setFilteredEntries(updatedEntries);

      // Add new theme if it doesn't exist
      if (newEntry.theme && !themes.includes(newEntry.theme)) {
        setThemes([...themes, newEntry.theme]);
      }
    }

    // Reset form
    setNewEntry({ title: "", content: "", theme: "", date: "" });
    setEditingEntryId(null);
    setIsAddingEntry(false);
  };

  // Edit an existing entry
  const editEntry = (entry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      theme: entry.theme,
      date: entry.date,
    });
    setEditingEntryId(entry.id);
    setIsAddingEntry(true);
  };

  // Delete an entry
  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    setFilteredEntries(updatedEntries);
  };

  // Add a comment to an entry
  const addComment = (entryId) => {
    if (!newComment.trim()) return;

    const updatedEntries = entries.map((entry) => {
      if (entry.id === entryId) {
        const newCommentObj = {
          id: entry.comments.length + 1,
          author: currentUser.firstname,
          text: newComment,
          timestamp: new Date().toISOString(),
        };
        return {
          ...entry,
          comments: [...entry.comments, newCommentObj],
        };
      }
      return entry;
    });

    setEntries(updatedEntries);
    setFilteredEntries(updatedEntries);
    setNewComment("");
    setActiveEntryForComment(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format timestamp for comments
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Check if user is family member
  const isFamilyMember = familyMembers.includes(currentUser.firstname);

  return (
    <div className="blog-body-BP">
      <div className="journal-container-BP">
        <div className="journal-content-BP">
          {/* Header */}
          <div className="journal-header-BP">
            <h1 className="journal-title-BP">Family Journal</h1>
            <p className="journal-subtitle-BP">
              Share and preserve our family memories
            </p>
          </div>

          {/* Controls */}
          <div className="controls-panel-BP">
            <div className="filters-container-BP">
              {/* Search */}
              <div className="search-container-BP">
                <div className="input-icon-wrapper-BP">
                  <Search className="input-icon-BP" size={18} />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    className="search-input-BP"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      filterEntries();
                    }}
                  />
                </div>
              </div>

              {/* Filter by theme */}
              <div className="theme-filter-BP">
                <div className="input-icon-wrapper-BP">
                  <Tag className="input-icon-BP" size={18} />
                  <select
                    className="theme-select-BP"
                    value={selectedTheme}
                    onChange={(e) => {
                      setSelectedTheme(e.target.value);
                      filterEntries();
                    }}
                  >
                    <option value="">All Themes</option>
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter by date */}
              <div className="date-filter-BP">
                <div className="input-icon-wrapper-BP">
                  <Calendar className="input-icon-BP" size={18} />
                  <input
                    type="date"
                    className="date-input-BP"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      filterEntries();
                    }}
                  />
                </div>
              </div>

              {/* Add new entry button */}
              <button
                className="add-entry-btn-BP"
                onClick={() => setIsAddingEntry(true)}
              >
                New Entry
              </button>
            </div>

            {/* Add/Edit Entry Form */}
            {isAddingEntry && (
              <div className="entry-form-BP">
                <h2 className="form-title-BP">
                  {editingEntryId ? "Edit Entry" : "Add New Entry"}
                </h2>
                <div className="form-fields-BP">
                  <div className="form-group-BP">
                    <label className="form-label-BP">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newEntry.title}
                      onChange={handleEntryChange}
                      className="form-input-BP"
                      placeholder="Entry title"
                      required
                    />
                  </div>
                  <div className="form-group-BP">
                    <label className="form-label-BP">Content</label>
                    <textarea
                      name="content"
                      value={newEntry.content}
                      onChange={handleEntryChange}
                      className="form-textarea-BP"
                      placeholder="Write your journal entry here..."
                      required
                    ></textarea>
                  </div>
                  <div className="form-row-BP">
                    <div className="form-group-BP half-width-BP">
                      <label className="form-label-BP">Theme</label>
                      <input
                        type="text"
                        name="theme"
                        value={newEntry.theme}
                        onChange={handleEntryChange}
                        className="form-input-BP"
                        placeholder="e.g., Nature, Sports, Travel"
                        list="theme-suggestions"
                      />
                      <datalist id="theme-suggestions">
                        {themes.map((theme) => (
                          <option key={theme} value={theme} />
                        ))}
                      </datalist>
                    </div>
                    <div className="form-group-BP half-width-BP">
                      <label className="form-label-BP">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newEntry.date}
                        onChange={handleEntryChange}
                        className="form-input-BP"
                      />
                    </div>
                  </div>
                  <div className="form-actions-BP">
                    <button
                      className="cancel-btn-BP"
                      onClick={() => {
                        setIsAddingEntry(false);
                        setNewEntry({
                          title: "",
                          content: "",
                          theme: "",
                          date: "",
                        });
                        setEditingEntryId(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-btn-BP"
                      onClick={saveEntry}
                      disabled={!newEntry.title || !newEntry.content}
                    >
                      {editingEntryId ? "Update Entry" : "Save Entry"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Journal Entries */}
          <div className="entries-container-BP">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div key={entry.id} className="entry-card-BP">
                  <div className="entry-content-BP">
                    <div className="entry-header-BP">
                      <div>
                        <h2 className="entry-title-BP">{entry.title}</h2>
                        <div className="entry-meta-BP">
                          <div className="meta-item-BP">
                            <Calendar size={14} />
                            <span>{formatDate(entry.date)}</span>
                          </div>
                          {entry.theme && (
                            <div className="meta-item-BP">
                              <Tag size={14} />
                              <span>{entry.theme}</span>
                            </div>
                          )}
                          <span className="author-BP">by {entry.author}</span>
                        </div>
                      </div>
                      {entry.author === currentUser.firstname && (
                        <div className="entry-actions-BP">
                          <button
                            className="edit-btn-BP"
                            onClick={() => editEntry(entry)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="delete-btn-BP"
                            onClick={() => deleteEntry(entry.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="entry-body-BP">
                      <p>{entry.content}</p>
                    </div>

                    {/* Comments Section */}
                    <div className="comments-section-BP">
                      <div className="comments-header-BP">
                        <MessageSquare size={18} className="comment-icon-BP" />
                        <h3 className="comments-title-BP">Comments</h3>
                        {!isFamilyMember && (
                          <div className="family-only-BP">
                            <Lock size={14} />
                            <span>Family members only</span>
                          </div>
                        )}
                      </div>

                      {/* Comment list */}
                      <div className="comments-list-BP">
                        {entry.comments.map((comment) => (
                          <div key={comment.id} className="comment-item-BP">
                            <div className="comment-header-BP">
                              <div className="comment-author-BP">
                                {comment.author}
                              </div>
                              <div className="comment-time-BP">
                                {formatTimestamp(comment.timestamp)}
                              </div>
                            </div>
                            <p className="comment-text-BP">{comment.text}</p>
                          </div>
                        ))}

                        {entry.comments.length === 0 && (
                          <p className="no-comments-BP">No comments yet.</p>
                        )}
                      </div>

                      {/* Add comment form - only for family members */}
                      {isFamilyMember && (
                        <div className="add-comment-BP">
                          {activeEntryForComment === entry.id ? (
                            <div className="comment-form-BP">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                className="comment-input-BP"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <button
                                className="send-comment-btn-BP"
                                onClick={() => addComment(entry.id)}
                              >
                                <Send size={16} />
                                Send
                              </button>
                            </div>
                          ) : (
                            <button
                              className="start-comment-btn-BP"
                              onClick={() => setActiveEntryForComment(entry.id)}
                            >
                              Add a comment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-entries-BP">
                <p>No journal entries found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
